import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mysql from 'mysql'
import { registerValidation } from './validations/reg.js'
import { authValidation } from './validations/auth.js'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
const app = express();

const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


// Настройки бд
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'anime_base'
});

// Подключение к бд и вывод в консоль состояния бд
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected (---anime_base---) to MySQL server');
});

app.use('/uploads', express.static('uploads'));

// Обработка начальной старницы
app.get('/', (req, res) => {
    res.json({
        info: 'Добро пожловать в API ANIFIM',
        version: '1.0',
        info2: 'Методы в API',
        method1: 'для получения комментариев ---/get-reviews/:id---',
        method2: 'для добавления комментариев ---/post-reviews---',
        method3: 'регистрация ---/register---',
        method4: 'авторизация ---/auth---',
        method5: 'получение из бд спиосок аниме по запросу serial или film ---/get-anime-list?type="ваш запрос"---',
    });
});

// Получение комментариев
app.get('/get-reviews/:id', (req, res) => {
    const id = req.params.id;
    connection.query(`SELECT * FROM reviews WHERE id_film = '${id}' ORDER BY id DESC`, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
// Получение списка обсуждения по конкретному айди
app.get('/get-discussion-card/:id', (req, res) => {
    const id = req.params.id;
    const messagesQuery = `SELECT * FROM discussion_by_id WHERE discussion_id = '${id}'`;
    connection.query(messagesQuery, (err, messages) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка сервера' });
            return;
        }
        const messageIds = messages.map(message => message.id);
        if (messageIds.length === 0) {
            // Обрабатываем случай, когда массив messageIds пуст
            res.json([]);
            return;
          }
        const repliesQuery = `SELECT * FROM replies WHERE replies.comment_id IN (${messageIds.join(',')})`;
        connection.query(repliesQuery, (err, replies) => {
            if (err) {
                console.error(err);
                res.status(404).json({ error: 'Ошибка сервера' });
                return;
            }
            const repliesByMessageId = {};
            for (const reply of replies) {
                if (!repliesByMessageId[reply.comment_id]) {
                    repliesByMessageId[reply.comment_id] = [];
                }
                repliesByMessageId[reply.comment_id].push(reply);
            }
            const messagesArray = messages.map(message => {
                const messageObj = {
                    id: message.id,
                    discussion_id: message.discussion_id,
                    user_id: message.user_id,
                    name: message.name,
                    text: message.text,
                    avatar: message.avatar,
                    replies: repliesByMessageId[message.id] || []
                };
                return messageObj;
            });
            res.json(messagesArray);
        });
    });
});
// Добавление комментариев
app.post('/post-reviews', (req, res) => {
    const { id_film, avatar, name, text, rating } = req.body;
    connection.query('INSERT INTO reviews (id_film, avatar, name, text, rating) VALUES (?, ?, ?, ?, ?)', [id_film, avatar, name, text, rating], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, id_film, avatar, name, text, rating });
    });
});


// Добавление обсуждения
app.post('/post-discussion', (req, res) => {
    const { name, theme, text } = req.body;
    connection.query('INSERT INTO discussion (name, theme, text) VALUES (?, ?, ?)', [name, theme, text], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, name, theme, text });
    });
});
// Добавление обсуждения по айди
app.post('/post-discussion-by-id', (req, res) => {
    const { discussion_id, user_id, name, theme, avatar, text } = req.body;
    connection.query('INSERT INTO discussion_by_id (discussion_id, user_id, name, theme, avatar, text) VALUES (?, ?, ?, ?, ?, ?)', [discussion_id, user_id, name, theme, avatar, text], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, discussion_id, user_id, name, theme, avatar, text });
    });
});
// Добавление reply по айди
app.post('/add-reply-id', (req, res) => {
    const { comment_id, user_id, name, theme, avatar, text } = req.body;
    connection.query('INSERT INTO replies (comment_id, user_id, name, theme, avatar, text) VALUES (?, ?, ?, ?, ?, ?)', [comment_id, user_id, name, theme, avatar, text], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, comment_id, user_id, name, theme, avatar, text });
    });
});

// Добавление в избранное
app.post('/add-to-fav', (req, res) => {
    try {
        const { id_user, img, title, text } = req.body;
        connection.query('INSERT INTO anime_favorites (id_user, img, title, text) VALUES (?, ?, ?, ?)', [id_user, img, title, text], (err, results) => {
            if (err) throw err;
            res.json({
                info: 'успешно!',
                id_user, img, title, text
            });
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка при добавлении"
        })
    }
});

// получение избранных по айди
app.get('/get-to-fav/:id', (req, res) => {
    try {
        const id = req.params.id;
        const query = `SELECT * FROM anime_favorites WHERE id_user = ${id}`;
        connection.query(query, (err, results) => {
            if (err) {
                res.status(404).json({
                    msg: "Не найдено",
                });
            } else {
                if (results == '') {
                    res.status(404).json({
                        msg: "Не найдено",
                    });
                }
                else {
                    res.json(results);
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка на стороне сервера"
        })
    }
});
// удаление из избранных по его айди
app.delete('/del-into-fav/:id', (req, res) => {
    try {
        const id = req.params.id;
        const query = `DELETE FROM anime_favorites WHERE id = ${id}`;
        connection.query(query, (err, results) => {
            if (err) {
                res.status(404).json({
                    msg: "Не найдено",
                });
            } else {
                if (results == '') {
                    res.status(404).json({
                        msg: "Не найдено",
                    });
                }
                else {
                    res.json({
                        results,
                        msg: `id: ${id} успешно удален`
                    });
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка на стороне сервера"
        })
    }
});


// Регистрация
app.post('/register', registerValidation, upload.single('avatar'), async (req, res) => {
    try {
        const { name, login, password } = req.body;
        const avatar = `${req.file.filename}`;
        await connection.query('SELECT * FROM users WHERE login = ?', [login], async (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                res.status(400).json({
                    succes: "false",
                    login: login,
                    msg: `Пользователь с логином ${login} уже существует`,
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);

                await connection.query('INSERT INTO users (name, login, password, avatar) VALUES (?, ?, ?, ?)', [name, login, hash, avatar], async (err, results) => {
                    const insertedId = results.insertId;
                    // console.log(insertedId)
                    const token = jwt.sign({
                        token_id: insertedId,
                    },
                        'secret123',
                    );
                    console.log(token)
                    res.json({
                        succes: "true",
                        userName: login,
                        userPassword: hash,
                        msg: `Пользователь с именем ${name} создан`,
                        token
                    });
                });

            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка при регистрации"
        })
    }
});

// Авторизация
app.post('/auth', authValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const { login, password } = req.body;
        await connection.query('SELECT * FROM users WHERE login = ?', [login], async (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                const isValidPass = await bcrypt.compare(password, results[0].password);
                const token = jwt.sign({
                    token_id: results[0].id,
                },
                    'secret123',
                );
                if (isValidPass) {
                    res.status(200).json({
                        succes: "true",
                        login: login,
                        msg: `Пользователь с логином ${login} авторизован`,
                        token,
                    });
                } else {
                    res.status(401).json({
                        msg: "Неверный логин или пароль"
                    });
                }
            } else {
                res.status(404).json({
                    msg: "Пользователь не найден"
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка при авторизации"
        })
    }
});

// получение из всех аниме
app.get('/get-anime-list-all', (req, res) => {
    try {
        const limit = req.query.limit;
        const query = `SELECT * FROM anime_list LIMIT ${limit}`;
        connection.query(query, (err, results) => {
            if (err) {
                res.status(500).json({
                    msg: "Ошибка"
                });
            } else {
                res.json(results);
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка на стороне сервера"
        })
    }
});
// получение из всех обсуждений
app.get('/get-discussion', (req, res) => {
    try {
        const query = `SELECT * FROM discussion  ORDER BY id DESC`;
        connection.query(query, (err, results) => {
            if (err) {
                res.status(500).json({
                    msg: "Ошибка"
                });
            } else {
                res.json(results);
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка на стороне сервера"
        })
    }
});

// получение из бд список аниме по катерогриями film и serial также работает и LIMIT
app.get('/get-anime-list', (req, res) => {
    try {
        const type = req.query.type;
        const limit = req.query.limit;
        const query = `SELECT * FROM anime_list WHERE type = ? LIMIT ${limit}`;
        connection.query(query, type, (err, results) => {
            if (err) {
                res.status(500).json({
                    msg: "Ошибка"
                });
            } else {
                res.json(results);
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка на стороне сервера"
        })
    }
});
// получение из бд список аниме по его айди
app.get('/get-anime/:id', (req, res) => {
    try {
        const id = req.params.id;
        const query = `SELECT * FROM anime_list WHERE id = ${id}`;
        connection.query(query, (err, results) => {
            if (err) {
                res.status(404).json({
                    msg: "Не найдено",
                });
            } else {
                if (results == '') {
                    res.status(404).json({
                        msg: "Не найдено",
                    });
                }
                else {
                    res.json(results);
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка на стороне сервера"
        })
    }
});
// получение из бд список обсуждения по его айди
app.get('/get-discussion-id/:id', (req, res) => {
    try {
        const id = req.params.id;
        const query = `SELECT * FROM discussion WHERE id = ${id}`;
        connection.query(query, (err, results) => {
            if (err) {
                res.status(404).json({
                    msg: "Не найдено",
                });
            } else {
                if (results == '') {
                    res.status(404).json({
                        msg: "Не найдено",
                    });
                }
                else {
                    res.json(results);
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка на стороне сервера"
        })
    }
});




// получение из бд список аниме для слайдера с кастомными обложками
app.get('/get-anime-slider', (req, res) => {
    const query = `SELECT * FROM slider`;
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({
                msg: "Ошибка на стороне сервера"
            });
        } else {
            res.json(results);
        }
    });
});

// получение инфы о пользователе по его айди
app.get('/account/:id', async (req, res) => {
    try {
        const id = await req.params.id;
        const query = await `SELECT id, name, avatar FROM users WHERE id = ${id}`;
        connection.query(query, (err, results) => {
            if (err) {
                res.status(404).json({
                    msg: "Не найдено",
                });
            } else {
                if (results == '') {
                    res.status(404).json({
                        msg: "Не найдено",
                    });
                }
                else {
                    res.json(results);
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Произошла ошибка на стороне сервера"
        })
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Локальный сервер ---http://localhost:${port} ---`);
});
