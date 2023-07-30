<script>
import axios from 'axios'
export default {
    data() {
        return {
            id: '',
            user_id: localStorage.getItem('user_id'),
            disc_title: '',
            disc_text: '',
            discussion_arr: [],
            discussion_list: [],
            name: '',
            avatar: '',
            text: '',
            reply_list: '',
            replyFormVisible: {},
            replyText: {},
            isAuth: false
        }
    },
    computed: {
        // /get-discussion-card
        getDiscussionCard() {
            axios.get(`/get-discussion-card/${this.id}`)
                .then(response => {
                    this.discussion_list = response.data
                })
                .catch(error => {
                    console.log(error)
                });
            return this.discussion_list
        },
    },



    methods: {
        addDiscussionById() {
            axios.post('/post-discussion-by-id/', {
                discussion_id: this.id,
                user_id: this.user_id,
                name: this.name,
                theme: this.disc_title,
                avatar: this.avatar,
                text: this.text
            })
                .then((response) => {
                    this.text = ''
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        addReply(id) {
            axios.post('/add-reply-id/', {
                comment_id: id,
                user_id: this.user_id,
                name: this.name,
                theme: this.disc_title,
                avatar: this.avatar,
                text: this.replyText[id]
            })
                .then((response) => {
                    this.replyText[id] = '',
                    this.replyFormVisible[id] = false
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        toggleReplyForm(messageId) {
            this.replyFormVisible[messageId] = !this.replyFormVisible[messageId];
            this.replyText[messageId] = '';
        },
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        this.id = this.$route.params.id
        axios.get(`/account/${this.user_id}`)
            .then(response => {
                this.name = response.data[0].name,
                    this.avatar = response.data[0].avatar,
                    this.isAuth = true
            })
            .catch(error => {
                console.log(error),
                this.isAuth = false
            });
        axios.get(`/get-discussion-id/${this.id}`)
            .then(response => {
                this.discussion_arr = response.data,
                    this.disc_title = response.data[0].theme
                this.disc_text = response.data[0].text
            })
            .catch(error => {
                console.log(error)
            });

    }
}
</script>
<template>
    <div class="container">
        <h2 class="disc_title">
            #{{ id }} {{ disc_title }}
        </h2>
        <p class="filter_title">Описание: <span class="search_filter">{{ disc_text }}</span></p>
        <div class="post_disc_wrapper" v-if="isAuth">
            <form @submit.prevent="addDiscussionById">
                <p class="reviews_posted_ul_title" style="margin-top: 0;">Оставить ответ</p>
                <input v-model="name" style="display: none;" сlass="reviews_write_name_input" required type="text"
                    placeholder="Введите">
                <p class="filter_title" style="margin-bottom: 0;">Автор: <span class="search_filter">{{ name }}</span></p>
                <textarea v-model="text" required placeholder="Текст записи"></textarea>
                <button class="btn">
                    отправить
                </button>
            </form>
        </div>



        <div class="post_disc_wrapper">
            <ul class="reviews_posted_ul">
                <p class="reviews_posted_ul_title" style="margin-top: 0;">Просмотр недавних от пользователей</p>
                <li class="reviews_posted_li" v-for="item in getDiscussionCard" :key="item.id">
                    <ul>
                        <li>
                            <div class="reviews_posted_li_avatar_wrapper">
                                <img :src="'http://localhost:4000/uploads/' + item.avatar">
                            </div>
                        </li>
                        <li>
                            <span class="reviews_posted_li_name">{{ item.name }}</span>
                            <span class="reviews_posted_li_par">
                                {{ item.text }}
                            </span>
                            <span class="reviews_posted_li_par2" @click="toggleReplyForm(item.id)"  v-if="isAuth">
                                Ответить
                            </span>
                        </li>
                    </ul>
                    <ul class="reply_ul">
                        <li v-for="reply in item.replies" :key="reply.id">
                            <ul>
                                <i class='bx bx-reply bx-rotate-180'></i>
                                <li>
                                    <div class="reviews_posted_li_avatar_wrapper_reply">
                                        <img :src="'http://localhost:4000/uploads/' + reply.avatar">
                                    </div>
                                </li>
                                <li>
                                    <span class="reviews_posted_li_name_reply">{{ reply.name }}</span>
                                    <span class="reviews_posted_li_par_reply">
                                        {{ reply.text }}
                                    </span>
                                </li>
                            </ul>

                        </li>
                    </ul>
                    <div class="add_reply_wpapper" v-if="replyFormVisible[item.id]">
                        <form @submit.prevent="addReply(item.id)">
                            <textarea v-model="replyText[item.id]" required placeholder="Текст ответа"
                                style="min-width: 100px !important;"></textarea>
                            <button type="submit" class="btn">
                                ответить
                            </button>
                        </form>
                    </div>
                </li>

            </ul>
        </div>


    </div>
</template>
<style scoped>
.add_reply_wpapper {
    margin-left: 85px;
}

.add_reply_wpapper form {
    display: flex;
    flex-direction: column;
    width: 300px;
}

.reviews_posted_li_name_reply {
    font-size: 18px;
    color: #ffffff;
    font-weight: 200;
    margin-bottom: 7px;
}

.reviews_posted_li_par_reply {
    font-size: 16px;
    color: #b6b6b6;
    margin-bottom: 7px;
    font-weight: 300;
}

.filter_title {
    margin-top: 10px;
    color: #fff;
    font-size: 18px;
    font-weight: 300;
    margin-bottom: 10px;
}

.reply_ul {
    position: relative;
    margin-top: 10px;
    margin-left: 85px;
    display: flex !important;
    flex-direction: column;
}

.reply_ul li ul {
    margin-bottom: 15px;
}

.reply_ul i {
    position: absolute;
    font-size: 30px;
    color: #818181;
    top: 10px;
}

.search_filter {
    opacity: 60%;
    font-weight: 200;
}

.reviews_posted_li_avatar_wrapper_reply {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    margin-right: 15px;
    margin-left: 40px;
}

.reviews_posted_li_avatar_wrapper_reply img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}





.post_disc_wrapper {
    margin: 20px 0;
    border-radius: 10px;
    background-color: #272727;
    padding: 40px;
}

.reviews_posted_ul_title {
    color: #fff;
    font-size: 20px;
    font-weight: 300;
    margin-top: 30px;
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
    color: #fff;
    margin-bottom: 7px;
}

.reviews_posted_li_par {
    font-size: 18px;
    color: #b6b6b6;
    margin-bottom: 7px;
    font-weight: 300;
}

.reviews_posted_li_par2 {
    font-size: 16px;
    color: #3789e2;
    padding: 5px 0;
    font-weight: 300;
    transition: 200ms all ease;
}

.reviews_posted_li_par2:hover {
    opacity: 80%;
    cursor: pointer;
}

.reviews_posted_li_par2:active {
    opacity: 60%;
}

.reviews_posted_li_text {
    font-size: 18px;
    color: #b6b6b6;
    font-weight: 200;
}

.reviews_posted_li ul {
    display: flex;
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