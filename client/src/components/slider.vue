<script>
import axios from 'axios'
export default {
    data() {
        return {
            counter: 1,
            sl_pos: 1230,
            sliders_: []
        }
    },
    methods: {
        btn_left() {
            if (this.counter < 1) {
                this.sl_pos = 1230 * 2
                this.counter = 2
            }
            else {
                this.counter--
                this.sl_pos = this.sl_pos - 1230
            }

        },
        btn_right() {
            if (this.counter < 2) {
                this.sl_pos = this.sl_pos + 1230
                this.counter++
            }
            else {
                this.sl_pos = 0
                this.counter = 0
            }

        }
    },
    mounted() {
        axios.get(`/get-anime-slider`)
            .then(response => {
                this.sliders_ = response.data
            })
            .catch(error => (console.log(error)));
    },
}
</script>

<template>
    <section class="slider">
        <div class="container">
            <div class="sliders">
                <ul class="slider_wrapper">
                    <router-link :to="`/anime-card/${item.anime_id}`" tag="li" class="slider_item" v-for="item in sliders_"
                        :style="{ transform: 'translate(-' + sl_pos + 'px)' }">
                        <p class="slider_age">
                            {{item.age_rating}}+
                        </p>
                        <p class="slider_title">
                            {{item.title}}
                        </p>
                        <img class="slider_img" :src="'http://localhost:4000/uploads/'+item.main_poster" :alt="'slider' + item.anime_id">
                    </router-link>
                </ul>
                <div class="slider_btn_wrapper">
                    <div @click="btn_left" class="btn_left"><i class='slider_ar bx bx-chevron-left bx-lg'></i></div>
                    <div @click="btn_right" class="btn_right"><i class='slider_ar bx bx-chevron-right bx-lg'></i></div>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
.slider {
    overflow-x: hidden;
}

.sliders {
    position: relative;
    overflow: show;
}

.slider_wrapper {
    margin: 0 auto;
    position: relative;
    margin-bottom: 30px;
    width: 1200px;
    height: 400px;
    border-radius: 10px;
    display: flex;
}

.slider_item {
    position: relative;
    border-radius: 10px;
    min-width: 1200px;
    height: 100%;
    background-color: #000000;
    margin-right: 30px;
    transition: all 650ms ease;
}

.slider_item:last-child {
    margin-right: 0;
}

.btn_left,
.btn_right {
    width: 65px;
    height: 65px;
    background-color: RGBA(255, 255, 255, 0.50);
    border-radius: 50%;
    z-index: 999999;
    backdrop-filter: blur(1px);
    transition: all 200ms;
}

.btn_left {
    margin-left: 20px;
}

.btn_right {
    margin-right: 20px;
}

.btn_left:hover,
.btn_right:hover {
    cursor: pointer;
    background-color: RGBA(255, 255, 255, 0.80);
}

.slider_btn_wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
}

.slider_ar {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    color: RGBA(255, 255, 255, 1);
    transition: all 200ms;
    border-radius: 50%;
    padding: 10px;
}

.slider_ar:hover {
    color: #000000;
}

.slider_img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 10px;
}
.slider_age{
    position: absolute;
    top: 15px;
    text-align: center;
    left: 20px;
    font-size: 18px;
    font-weight: 300;
    color: #ffffff;
    background-color: rgba(31, 31, 31, 0.63);
    padding: 10px 20px 10px 25px;
    border-radius: 10px;
    transition: all 200ms;
}
.slider_age:hover{
    background-color: rgba(0, 0, 0, 0.904);
}
.slider_title{
    position: absolute;
    bottom: 15px;
    left: 20px;
    font-size: 18px;
    font-weight: 300;
    color: #ffffff;
    background-color: rgba(31, 31, 31, 0.63);
    padding: 10px 25px 10px 25px;
    border-radius: 15px;
    transition: all 200ms;
}
.slider_title:hover{
    background-color: rgba(0, 0, 0, 0.904);
}
</style>