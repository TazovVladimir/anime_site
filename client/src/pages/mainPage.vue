<script>
import axios from 'axios'
import sliders from '../components/slider.vue'
export default {
    data() {
        return {
            anime_arr: [],
            btn_show_pagination_value: 10,
            isBtn_show_pagination: true,
            isPreload: true,
            selectFilter: '',
            selectFilterCountry: '',
            selectFilterRating: ''
        }
    },
    mounted() {

    },
    components: {
        sliders
    },
    methods: {
        btn_show_pagination() {
            if (this.btn_show_pagination_value <= 50) {
                this.btn_show_pagination_value += 10
                if (this.btn_show_pagination_value == 50) {
                    this.isBtn_show_pagination = false
                }
                this.isPreload = true
            }
        },
        selectFilterToNull() {
            this.selectFilter = ''
        },
        selectFilterRatingToNull(){
            this.selectFilterRating = ''
        },
        selectFilterCountryToNull(){
            this.selectFilterCountry = ''
        }
    },
    computed: {
        getData() {
            axios.get(`/get-anime-list-all?limit=60`)
                .then(response => {

                    this.anime_arr = response.data;
                });
            return this.anime_arr
        },
        // getData() {
        //     axios.get(`/get-anime-list-all?limit=${this.btn_show_pagination_value}`)
        //         .then(response => {

        //             this.anime_arr = response.data;
        //         });
        //     return this.anime_arr
        // },
        filteredItems() {
            const filteredItems = this.getData.filter(item => {
                const selectedTypeMatch = this.selectFilter.length === 0 || this.selectFilter.includes(item.all_genres);
                const selectFilterCountry = this.selectFilterCountry.length === 0 || this.selectFilterCountry.includes(item.countries);
                const selectFilterRating = this.selectFilterRating.length === 0 || this.selectFilterRating.includes(item.rating);
                this.isPreload = false
                return selectedTypeMatch && selectFilterCountry && selectFilterRating;
            });
            return filteredItems;

        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}
</script>

<template>
    <sliders></sliders>
    <section class="section_main">
        <div class="main_options">
            <div class="container">
                <ul class="main_options_wrapper">
                    <li class="main_options_item">
                        <span class="titles">
                            Жанры
                            <i class='icon bx bx-chevron-down'></i>
                        </span>
                        <span class="main_options_drop_wrapper">
                            <span class="main_options_drop_item">
                                <input type="radio" id="боевик" value="боевик" v-model="selectFilter" class="filter_radio">
                                <label for="боевик">Боевик</label>
                            </span>
                            <span class="main_options_drop_item">
                                <input type="radio" id="романтика" value="романтика" v-model="selectFilter"
                                    class="filter_radio">
                                <label for="романтика">Романтика</label>
                            </span>
                            <span class="main_options_drop_item">
                                <input type="radio" id="драма" value="драма" v-model="selectFilter" class="filter_radio">
                                <label for="драма">Драма</label>
                            </span>
                            <span class="main_options_drop_item">
                                <input type="radio" id="комедия" value="комедия" v-model="selectFilter"
                                    class="filter_radio">
                                <label for="комедия">Комедия</label>
                            </span>
                            <span class="main_options_drop_item">
                                <input type="radio" id="фэнтези" value="фэнтези" v-model="selectFilter"
                                    class="filter_radio">
                                <label for="фэнтези">Фэнтези</label>
                            </span>
                        </span>
                    </li>
                    <li class="main_options_item">
                        <span class="titles">
                            Страна производства
                            <i class='icon bx bx-chevron-down'></i>
                        </span>
                        <span class="main_options_drop_wrapper">
                            <span class="main_options_drop_item">
                                <input type="radio" id="Япония" value="Япония" v-model="selectFilterCountry"
                                    class="filter_radio">
                                <label for="Япония">Япония</label>
                            </span>
                            <span class="main_options_drop_item">
                                <input type="radio" id="Китай" value="Китай" v-model="selectFilterCountry"
                                    class="filter_radio">
                                <label for="Китай">Китай</label>
                            </span>
                        </span>
                    </li>
                    <li class="main_options_item">
                        <span class="titles">
                            Рейтинг
                            <i class='icon bx bx-chevron-down'></i>
                        </span>
                        <span class="main_options_drop_wrapper">
                            <span class="main_options_drop_item">
                                <input type="radio" id="one" value="1" v-model="selectFilterRating"
                                    class="filter_radio">
                                <label for="one">Один</label>
                            </span>
                            <span class="main_options_drop_item">
                                <input type="radio" id="two" value="2" v-model="selectFilterRating"
                                    class="filter_radio">
                                <label for="two">Два</label>
                            </span>
                            <span class="main_options_drop_item">
                                <input type="radio" id="three" value="3" v-model="selectFilterRating"
                                    class="filter_radio">
                                <label for="three">Три</label>
                            </span>
                            <span class="main_options_drop_item">
                                <input type="radio" id="four" value="4" v-model="selectFilterRating"
                                    class="filter_radio">
                                <label for="four">Четыре</label>
                            </span>
                            <span class="main_options_drop_item">
                                <input type="radio" id="five" value="5" v-model="selectFilterRating"
                                    class="filter_radio">
                                <label for="five">Пять</label>
                            </span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="anime_films_wrapper">
            <div class="container">
                <div class="preload" v-if="isPreload">
                    <span class="preload_item">
                        <i class='bx bx-loader-alt bx-spin bx-lg'></i>
                    </span>
                </div>


                <p v-if="selectFilter != '' || selectFilterCountry != '' || selectFilterRating !=''" class="filter_title">Результаты по фильтру:
                    <span class="search_filters" v-if="selectFilter !=''">
                        {{ selectFilter }}
                        <span class="btn-to-null" @click="selectFilterToNull" >
                            ✖
                        </span>
                    </span>
                    <span class="search_filters" v-if="selectFilterCountry !=''">{{ selectFilterCountry }}
                        <span class="btn-to-null" @click="selectFilterCountryToNull">
                            ✖
                        </span>
                    </span>
                    <span class="search_filters" v-if="selectFilterRating !=''">{{ selectFilterRating }}
                        <span class="btn-to-null" @click="selectFilterRatingToNull">
                            ✖
                        </span>
                    </span>
                </p>
                
                <p v-else class="filter_title">Результаты по фильтру: <span class="search_filters"> ничего не выбрано
                    </span></p>

                <ul class="card_anime_films">
                    <router-link :to="`/anime-card/${item.id}`" tag="li" class="card_anime_films_item"
                        v-for="item in filteredItems" :key="item.id">
                        <img class="card_anime_films_item_img" :src="'http://localhost:4000/uploads/' + item.poster_url"
                            :alt="item.id">
                        <span class="rating"><span class="rating_value">{{
                            item.rating }}</span></span>
                        <span class="card_anime_films_item_span_title">
                            {{ item.title }}
                        </span>
                    </router-link>
                </ul>
                <!-- <div class="btn_show_pagination">
                    <div v-if="isBtn_show_pagination" @click="btn_show_pagination" class="btn">Показать еще 10</div>
                </div> -->
            </div>
        </div>
    </section>
</template>
<style scoped>
.btn-to-null {
    position: absolute;
    padding: 5px;
    top: -15px;
    right: -40px;
    display: block;
    color: rgb(224, 80, 80);
    margin-right: 20px;
    margin-left: 5px;
    transition: 200ms all ease;
    font-size: 15px;
}

.btn-to-null:hover {
    opacity: 70%;
    cursor: pointer;
}

.search_filters,
.filter_title {
    display: flex;
    align-items: center;
}
.search_filters:first-child {
    margin-left: 10px;
}
.search_filters {
    position: relative;
    margin-right: 30px;
    display: block;
    color: #727272;
    font-weight: 300;
}

.main_options {
    background-color: #272727;
    width: 100%;
    color: #fff;
    font-weight: 300;
    font-size: 16px;
}

.filter_radio {
    display: none;
}

.filter_title {
    color: #fff;
    font-size: 18px;
    font-weight: 300;
    /* margin-bottom: 10px; */
    margin-top: 30px;
}

.main_options_wrapper {
    display: flex;
    align-items: center;
}

.main_options_drop_item {
    display: block;
    font-weight: 200;
    transition: 200ms all ease;
    color: #fff;
}

.main_options_drop_item:hover {
    background-color: #1f1f1f;
    color: #fff;
}

.main_options_drop_item:active {
    background-color: #333333;
}

.main_options_item {
    margin-right: 15px;
    position: relative;
    padding: 20px 20px;
    transition: 200ms all ease;
}

.main_options_item:active {
    background-color: #333333;
}

.main_options_item:hover {
    cursor: pointer;
    background-color: #1f1f1f;
}

.main_options_item:hover .main_options_drop_wrapper {
    display: block;
}

.titles {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 25px;
}

.main_options_drop_wrapper {
    position: absolute;
    display: none;
    top: 60px;
    right: 0;
    z-index: 999;
    padding: 15px 0;
    background: rgba(49, 49, 49, 0.863);
    box-shadow: 0 8px 32px 0 rgba(37, 37, 37, 0.37);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    border-radius: 4px;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
}

.main_options_drop_item label {
    display: block;
    padding: 5px 20px;
    display: block;
    font-weight: 200;
    transition: 200ms all ease;
    color: #fff;
    cursor: pointer;
    width: 100%;
}

.icon {
    font-size: 20px;
    position: absolute;
    top: -1px;
    right: -10px;
}

.card_anime_films {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(5, 215px);
    grid-column-gap: 30px;
    grid-row-gap: 110px;
    margin-bottom: 100px;
}

.card_anime_films_item {
    height: 350px;
    transition: transform 400ms ease;
    position: relative;
}

.card_anime_films_item:hover {
    cursor: pointer;
    transform: scale(1.012, 1.012);
}

.card_anime_films_item_span_title {
    display: block;
    color: #fff;
    font-size: 16px;
    font-weight: 200;
    margin-top: 10px;
}

.card_anime_films_item_img {
    border-radius: 10px;
    /* min-width: 100%; */
    min-width: 215px;
    max-width: 215px;
    height: 100%;
    object-fit: cover;
}

.btn_show_pagination {
    height: 38px;
    width: 250px;
    margin: 0 auto;
}

.btn_show_pagination .btn {
    text-align: center;
}



.anime_films_wrapper {
    position: relative;
}
</style>