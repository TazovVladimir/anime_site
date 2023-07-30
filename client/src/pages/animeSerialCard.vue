<script>
import axios from 'axios'
export default {
    data() {
        return {
            anime_arr: [],
            id: '',
            isFind: false,
            avatar: '',
            name: '',
            text: '',
            rating: '',
            allReviews: [],
            isReviews: true,
            user_id: localStorage.getItem('user_id'),
            added: false,
            isAuth: false
        }
    },
    computed: {
        getReviews() {
            axios.get(`/get-reviews/${this.id}`)
                .then(response => {
                    this.allReviews = response.data
                })
                .catch(error => {
                    console.log(error)
                });
            return this.allReviews
        }
    },
    mounted() {
        this.id = this.$route.params.id

        axios.get(`/get-anime/${this.id}`)
            .then(response => {
                this.anime_arr = response.data,
                    this.isFind = true
            })
            .catch(error => {
                console.log(error)
                this.isFind = false
            });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        axios.get(`/account/${this.user_id}`)
            .then(response => {
                this.name = response.data[0].name,
                    this.avatar = response.data[0].avatar,
                    this.isAuth = true
            })
            .catch(error => {
                console.log(error)
                this.isAuth = false
            });

    },
    methods: {
        addReviews() {
            axios.post('/post-reviews/', {
                id_film: this.id,
                avatar: this.avatar,
                name: this.name,
                text: this.text,
                rating: this.rating
            })
                .then((response) => {
                    this.text = '',
                        this.rating = ''
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        addToFav() {
            axios.post('/add-to-fav', {
                id_user: this.user_id,
                img: this.anime_arr[0].poster_url,
                title: this.anime_arr[0].title,
                text: this.anime_arr[0].description,
            })
                .then(response => {
                    console.log(response);
                    this.added = true;
                })
                .catch(error => (console.log(error)));
        }
    }
}
</script>

<template>
    <div v-if="isFind">
        <section class="section_anime_card">

            <div class="container">
                <h3 class="section_anime_card_title" v-for="item in anime_arr">{{ item.title }}</h3>
                <div class="wrapper">

                    <div class="section_anime_card_item">
                        <div class="anime_img">
                            <img v-for="item in anime_arr" :src="'http://localhost:4000/uploads/'+item.poster_url" alt="">
                            <span v-for="item in anime_arr" class="rating"><span class="rating_value">{{
                                item.rating }}</span></span>

                            <!-- && isAuth == true" -->


                            <div v-if="isAuth == true">
                                <!-- пока не добавил в избр -->
                                <div v-if="added == false" class="btn_add_to_list" @click="addToFav()">
                                    Добавить в список
                                    <span class="btn_add_to_list_arr">
                                        <i class='bx bx-chevron-down bx-sm'></i>
                                    </span>
                                </div>
                                <!-- добавил в избр -->
                                <div v-else class="btn_add_to_list_added">
                                    Вы уже добавили
                                </div>
                            </div>
                            <div v-else>
                                <div class="btn_add_to_list_added">
                                    Только для авторизованных
                                </div>
                            </div>






                        </div>
                    </div>
                    <div class="description_right">
                        <ul>
                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Название в оригинале:</span><span
                                    class="description_right_description">{{ item.title_orig }}</span></li>
                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Описание:</span><span
                                    class="description_right_description">{{ item.description }}</span></li>
                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Тип:</span>
                                <span v-if="item.type == 'serial'" class="description_right_description">Сериал</span>
                                <span v-else class="description_right_description">Фильм</span>
                            </li>
                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Год выпуска:</span><span
                                    class="description_right_description">{{ item.year }}</span></li>

                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Жанры:</span><span
                                    class="description_right_description">{{ item.all_genres }}</span></li>

                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Страна производства:</span><span
                                    class="description_right_description">{{
                                        item.countries }}</span></li>
                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Производитель:</span><span
                                    class="description_right_description">{{ item.anime_studios
                                    }}</span></li>
                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Режисер:</span><span
                                    class="description_right_description">{{
                                        item.directors }}</span></li>
                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Дата выхода в прокат:</span><span
                                    class="description_right_description">{{ item.released_at }}</span>
                            </li>
                            <li class="description_right_li" v-for="item in anime_arr"><span
                                    class="description_right_title">Возрастной рейтинг:</span><span
                                    class="description_right_description">{{ item.age_rating }}+</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <section class="anime_episodes">
            <div class="container">
                <div class="vidio_player">
                    <iframe id="kodik-player" v-for="item in anime_arr" :src="item.link" width="100%" height="500px"
                        frameborder="0" allowfullscreen allow="autoplay *; fullscreen *"></iframe>
                </div>
            </div>
        </section>
        <section class="reviews_wpapper">
            <div class="container">
                <div class="reviews">
                    <form @submit.prevent="addReviews" v-if="isAuth">
                        <p class="reviews_title">Оставить комментарий</p>
                        <input style="display: none;" v-model="name" required type="text"
                            placeholder="Введите">
                        <textarea v-model="text" required placeholder="Текст комментария">
                                                                            </textarea>
                        <div class="rating-area">
                            <input required type="radio" v-model="rating" id="star-5" name="rating" value="5">
                            <label for="star-5" title="Оценка «5»"></label>
                            <input required type="radio" v-model="rating" id="star-4" name="rating" value="4">
                            <label for="star-4" title="Оценка «4»"></label>
                            <input required type="radio" v-model="rating" id="star-3" name="rating" value="3">
                            <label for="star-3" title="Оценка «3»"></label>
                            <input required type="radio" v-model="rating" id="star-2" name="rating" value="2">
                            <label for="star-2" title="Оценка «2»"></label>
                            <input required type="radio" v-model="rating" id="star-1" name="rating" value="1">
                            <label for="star-1" title="Оценка «1»"></label>
                        </div>
                        <button class="btn">
                            отправить
                        </button>
                    </form>
                    <div v-if="allReviews">
                        <ul class="reviews_posted_ul">
                            <p class="reviews_posted_ul_title">Комментарии пользователей</p>
                            <li class="reviews_posted_li" v-for="item in getReviews">
                                <ul>
                                    <li>
                                        <div class="reviews_posted_li_avatar_wrapper">
                                            <img :src="'http://localhost:4000/uploads/' + item.avatar">
                                        </div>
                                    </li>
                                    <li>
                                        <span class="reviews_posted_li_name">{{ item.name }}</span>
                                        <span class="reviews_posted_li_text">{{ item.text }}</span>
                                        <span class="reviews_posted_li_rating">
                                            <span v-if="item.rating == 1">
                                                <span class="star"></span>
                                            </span>
                                            <span v-if="item.rating == 2">
                                                <span class="star"></span>
                                                <span class="star"></span>
                                            </span>
                                            <span v-if="item.rating == 3">
                                                <span class="star"></span>
                                                <span class="star"></span>
                                                <span class="star"></span>
                                            </span>
                                            <span v-if="item.rating == 4">
                                                <span class="star"></span>
                                                <span class="star"></span>
                                                <span class="star"></span>
                                                <span class="star"></span>
                                            </span>
                                            <span v-if="item.rating == 5">
                                                <span class="star"></span>
                                                <span class="star"></span>
                                                <span class="star"></span>
                                                <span class="star"></span>
                                                <span class="star"></span>
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <p class="reviews_posted_ul_title">Комментариев нет</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <div v-else>
        <div class="container">
            <p class="error">
                По вашему запросу
                <span class="error_id"> "{{ id }}"</span> не найден
                <router-link class="error_back" to="/">вернуться</router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
.reviews_posted_ul_title {
    color: #fff;
    font-size: 20px;
    font-weight: 300;
    margin-top: 30px;
}

input[type='text'] {
    padding-left: 15px;
    border: 2px solid #007DFF;
}

input:focus {
    outline: none !important;
    border-color: #686868;
    background-color: #414141 !important;
}

.reviews_wpapper {
    margin: 30px 0;
}

.reviews {
    border-radius: 10px;
    background-color: #2F2F2F;
    opacity: 87%;
    padding: 40px;
}


.reviews_posted_li ul {
    display: flex;
}

.reviews_write_name {
    display: block;
    font-size: 16px;
    font-weight: 300;
    color: rgb(197, 197, 197);
    margin-bottom: 10px;
}

.reviews_posted_li {
    padding: 30px 0;
    border-bottom: 1px solid rgb(70, 70, 70);
}

.reviews_posted_li:last-child {
    border: none;
}

.reviews_posted_li ul li:first-child {
    margin-right: 20px;
}

.reviews_posted_li ul li:last-child {
    display: flex;
    flex-direction: column;
}

.reviews_posted_li_name {
    font-size: 20px;
    color: #007DFF;
    margin-bottom: 7px;
}

.reviews_posted_li_text {
    font-size: 18px;
    color: #b6b6b6;
    font-weight: 200;
}


.reviews_title {
    font-size: 22px;
    margin-bottom: 20px;
    color: #fff;
}


.section_anime_card_title {
    color: #fff;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 400;
}

.section_anime_card_item img {
    width: 290px;
    height: 416px;
    border-radius: 10px;
    object-fit: cover;
}

.anime_img {
    margin-right: 40px;
    position: relative;
}

.section_anime_card_item {
    display: flex;
}

.btn_add_to_list_arr {
    display: block;
    position: absolute;
    top: 8px;
    right: 20px;
}

.vidio_player {
    margin-top: 30px;
}

#kodik-player {
    border-radius: 10px;
}

.screen_ul_img {
    max-width: 200px;
    min-width: 200px;
    max-height: 120px;
    object-fit: cover;
    margin-right: 15px;
}

.error {
    font-size: 18px;
    color: #fff;
}

.error_back {
    color: #007DFFDE;
}

.error_id {
    color: rgb(163, 163, 163);
}

.wrapper {
    display: flex;
}

.description_right_title {
    font-size: 17px;
    color: rgb(143, 143, 143);
    min-width: 220px;
    max-width: 220px;
    margin-right: 20px;
}

.description_right_description {
    font-size: 17px;
    font-weight: 300;
    color: #fff;
}

.description_right_description::after {
    content: ',';
    margin-right: 8px;
}

.description_right_description:last-child:after {
    content: '';
}

.description_right_li {
    display: flex;
    margin-bottom: 11px;
}

.description_right {
    white-space: nowrap;
    overflow: hidden;
}

.reviews_posted_li_avatar_wrapper {
    width: 70px;
    height: 70px;
    background-color: #fff;
    border-radius: 50%;
}

.reviews_posted_li_avatar_wrapper img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
}
</style>