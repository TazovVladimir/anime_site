<script>
import axios from 'axios'
export default {
    data() {
        return {
            anime_arr: [],
            isPreload: true,
            filter: '',
        }
    },
    mounted() {
        axios.get(`/get-anime-list?type=serial&limit=100`)
            .then(response => {
                this.isPreload = false
                this.anime_arr = response.data
            })
            .catch(error => (console.log(error)));
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    },
    computed: {
        filter_itemss() {
            return this.anime_arr.filter(item => item.title.indexOf(this.filter) !== -1)
        },

    }
}
</script>
<template>
    <section class="section_anime_serial">
        <div class="container">
            <h2>Список аниме сериалов</h2>
            <div class="filter_wrapper">
                <p class="filter_title">Поиск по названию: <span class="search_filter">{{ filter }}</span></p>
                <div class="search">
                    <span class="header_search_el"><i class='bx bx-search'></i></span>
                    <input v-model="filter" type="text" placeholder="Поиск">
                </div>
            </div>
            <div class="preload" v-if="isPreload">
                <span class="preload_item">
                    <i class='bx bx-loader-alt bx-spin bx-lg'></i>
                </span>
            </div>
            <ul class="card_anime_films">
                <router-link :to="`/anime-card/${item.id}`" tag="li" class="card_anime_films_item"
                    v-for="(item, index, key) in filter_itemss">
                    <span class="rating"><span class="rating_value">{{
                        item.rating }}</span></span>
                    <img class="card_anime_films_item_img" :src="'http://localhost:4000/uploads/'+item.poster_url" alt="">
                    <span class="card_anime_films_item_span_title">
                        {{ item.title }}
                    </span>
                </router-link>
            </ul>
        </div>
    </section>
</template>
<style scoped>
.card_anime_films {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(5, 215px);
    grid-column-gap: 30px;
    grid-row-gap: 110px;
    margin-bottom: 100px;
}

.card_anime_films_item {
    position: relative;
    height: 350px;
    transition: transform 400ms ease;
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

.filter_wrapper {
    margin: 20px 0;
}

.filter_title {
    color: #fff;
    font-size: 18px;
    font-weight: 300;
    margin-bottom: 10px;
}

.search {
    position: relative;
}
</style>