<script>
import axios from 'axios'
export default {
    data() {
        return {
            isAuth: false,
            name: '',
            theme: '',
            text: '',
            user_id: localStorage.getItem('user_id'),
            discussion_arr: [],
        }
    },
    computed: {
        getDiscussion() {
            axios.get(`/get-discussion`)
                .then(response => {
                    this.discussion_arr = response.data
                })
                .catch(error => {
                    console.log(error)
                });
            return this.discussion_arr
        }
    },
    methods: {
        addDiscussion() {
            axios.post('/post-discussion/', {
                name: this.name,
                theme: this.theme,
                text: this.text,
            })
                .then((response) => {
                    this.theme = '',
                        this.text = ''
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
    mounted() {
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
                console.log(error),
                this.isAuth = false
            });
    }
}
</script>
<template>
    <section class="forum_about" v-if="isAuth">
        <div class="container">
            <h2 class="disc_title">
                Добавить обсуждения
            </h2>
            <div class="post_disc_wrapper">
                <form @submit.prevent="addDiscussion" >
                    <p class="reviews_title">Начать обсуждение - заполните все поля</p>
                    <input v-model="name" style="display: none;" сlass="reviews_write_name_input" required type="text"
                        placeholder="Введите">
                    <p class="reviews_posted_ul_title" style="margin-top: 0; margin-bottom: 20px;">Автор: {{ name }}</p>
                    <input class="reviews_write_name_input" v-model="theme" type="text" required
                        placeholder="Тема обсуждения">
                    <textarea v-model="text" required placeholder="Текст осуждения">
                                                                            </textarea>
                    <button class="btn">
                        начать
                    </button>
                </form>
            </div>
        </div>
    </section>
    <section>
        <div class="container">
            <h2>Список обсуждений</h2>
            <ul class="all_disc">
                <li class="all_disc_item" v-for="item in getDiscussion">
                    <span class="items_wrapper">
                        <span class="items_wrapper_index">
                            #{{ item.id }} {{ item.theme }}
                        </span>
                        <span class="theme-title">
                            {{ item.name }}
                        </span>
                        <span class="items_wrapper_text">
                            {{ item.text }}
                        </span>
                    </span>
                    <router-link :to="`/discussion-card/${item.id}`" class="to_disc_a" title="Перейти к обсуждению">
                        <span class="arr_right_to">
                            <i class='bx bx-chevron-right'></i>
                        </span>
                    </router-link>
                </li>
            </ul>



            <!-- <div class="post_disc_wrapper">
                <ul class="reviews_posted_ul">
                    <p class="reviews_posted_ul_title" style="margin-top: 0;">Недавние</p>
                    <li class="reviews_posted_li">
                        <ul>
                            <li>
                                <div class="reviews_posted_li_avatar_wrapper">
                                    <img src='http://localhost:4000/uploads/denis.jpg'>
                                </div>
                            </li>
                            <li>
                                <span class="reviews_posted_li_name">Никита</span>
                                <span class="reviews_posted_li_par">
                                    Тема обсуждения:
                                    <span class="reviews_posted_li_par2">
                                        Николай джелый
                                    </span>
                                </span>
                                <span class="reviews_posted_li_par">
                                    Текст обсуждения:
                                    <span class="reviews_posted_li_par2">
                                        выфвыфв ыфвф выфвф вфывфв ыфв ыфвфв фв фы вфв фывф вфывфв ыфвф выфвыф выфвфвф
                                        вфывыфв фывыф
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </li>

                </ul>
            </div> -->
        </div>
    </section>
</template>
<style scoped>
.to_disc_a {
    transition: all 200ms ease;
}

.to_disc_a:hover {
    opacity: 70%;
    cursor: pointer;
}

.to_disc_a:active {
    opacity: 50%;
}

.arr_right_to {
    display: block;
    position: absolute;
    top: 50%;
    right: 40px;
    transform: translate(0, -50%);
}

.arr_right_to i {
    color: #fff;
    font-size: 30px;
    background-color: #414141;
    padding: 10px;
    border-radius: 7px;
}

.theme-title {
    color: #fff;
    font-size: 19px;
    font-weight: 300;
}

.items_wrapper_index {
    color: #007DFF;
    font-size: 20px;
    margin-bottom: 10px;
}

.items_wrapper {
    display: flex;
    flex-direction: column;
}

.items_wrapper_text {
    display: block;
    margin-top: 10px;
    color: #8b8b8b;
    font-size: 18px;
    font-weight: 300;
}

.all_disc {
    display: flex;
    width: 100%;
    flex-direction: column;
    margin: 20px 0;
}

.all_disc_item {
    position: relative;
    background-color: #272727;
    width: 100%;
    padding: 20px 40px;
    padding-right: 120px;
    margin-bottom: 20px;
    border-radius: 10px;
}

.all_disc_item:last-child {
    margin-bottom: 0;
}





.disc_title {
    display: flex;
    position: relative;
    width: 330px;
}

.reviews_posted_ul_title {
    color: #fff;
    font-size: 20px;
    font-weight: 300;
    margin-top: 30px;
}



.reviews_title {
    font-size: 22px;
    margin-bottom: 20px;
    color: #fff;
}

.post_disc_wrapper {
    margin: 20px 0;
    border-radius: 10px;
    background-color: #272727;
    padding: 40px;
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

</style>