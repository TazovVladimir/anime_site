<script>
import axios from 'axios'
export default {
    data() {
        return {
            account_info: [],
            user_id: localStorage.getItem('user_id'),
            favArray: null
        }
    },
    methods: {
        exit() {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            this.account_info = [];
            this.$store.dispatch('delUserStatus');
            this.$router.push('/')
        },
        async del_into_fav(fav_id, index) {
            try {
                await axios.delete(`/del-into-fav/${fav_id}`)
                this.favArray.splice(index, 1);
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        const data = localStorage.getItem('token');
        if (data) {
            this.$store.dispatch('setUserStatus');
        }
        else {
            this.$router.push('/');
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        axios.get(`/account/${this.user_id}`)
            .then(response => {
                this.account_info = response.data
            })
            .catch(error => (console.log(error)));

        axios.get(`/get-to-fav/${this.user_id}`)
            .then(response => {
                console.log(response);
                this.favArray = response.data;
            })
            .catch(error => (console.log(error)));

    },
    computed: {

    }
}
</script>
<template>
    <div class="container">
        <div class="account_wrapper">
            <div class="account-left">
                <span title="Выход" @click="exit" class="exit-acc-el"><i class='bx bx-exit bx-sm'></i></span>
                <div class="avatar_wrapper">
                    <div class="avatar_wrapper-change-avatar">
                        изменить аватарку
                    </div>
                    <img v-for="item in account_info" :src="'http://localhost:4000/uploads/' + item.avatar">
                </div>
                <div class="account_info">
                    <span class="account_info_name" v-for="item in account_info">
                        {{ item.name }}
                    </span>
                    <!-- <span class="account_info_lastname" v-for="item in account_info">
                            {{item.}}
                        </span> 
                    -->
                </div>
                <div class="con">
                    <span class="con_name">
                        Россия
                    </span>
                </div>
            </div>
            <div class="account-right">
                <h2>Ваш список аниме</h2>
                <div v-if="favArray == null">
                    <span class="empty-span">
                        Вы ничего не добавили...
                    </span>
                </div>
                <div v-else>
                    <ul class="fav-ul">
                        <li class="fav-item" v-for="(item, index) in favArray" :key="index">
                            <span @click="del_into_fav(item.id, index)" title="Удалить из листа"
                                class="del_into_fav">✖</span>
                            <span class="fav-img-wrapper">
                                <img :src="'http://localhost:4000/uploads/'+item.img" alt="fav-img">
                            </span>
                            <span class="fav-title-text">
                                <span class="fav-title">
                                    {{ item.title }}
                                </span>
                                <span class="fav-text">
                                    {{ item.text }}
                                </span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.empty-span {
    display: block;
    font-weight: 300;
    margin: 10px 0;
    color: #ffffff;
    opacity: 80%;
    font-size: 16px;
}

.fav-ul {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
}

.fav-item {
    position: relative;
    z-index: 1;
    background-color: #1a1a1a;
    margin-bottom: 15px;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    overflow: hidden;
    transition: 200ms background-color ease;
    color: #fff
}
.fav-item:last-child {
    margin-bottom: 0;
}
/* .fav-item:hover {
    background-color: #1d1d1d;
}
.fav-item:active {
    background-color: #111111;
} */

.fav-item span {
    display: block;
}

.fav-img-wrapper {
    max-width: 90px;
    max-height: 90px;
    min-width: 90px;
    min-height: 90px;
    background-color: #fff;
    border-radius: 5px;
    margin-right: 20px;
}

.fav-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
}

.fav-title {
    font-size: 18px;
    font-weight: 300;
    margin-bottom: 5px;
}

.fav-text {
    font-size: 16px;
    font-weight: 200;
    opacity: 80%;
}

.fav-title-text {
    display: flex;
    flex-direction: column;
}

.del_into_fav {
    display: block;
    position: absolute;
    z-index: 99;
    right: 22px;
    top: 17px;
    transition: 200ms all ease;
}

.del_into_fav:hover {
    opacity: 70%;
    cursor: pointer;
}

.del_into_fav:active {
    opacity: 50%;
}









.container {
    color: #fff;
}

.account_wrapper {
    padding-top: 5px;
    display: flex;
    justify-content: space-between;
}

.account-left {
    position: relative;
    padding: 30px;
    border-radius: 10px;
    height: 220px;
    width: 28%;
    background-color: #272727;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.account-right {
    padding: 30px;
    border-radius: 10px;
    width: 70%;
    min-height: 200px;
    background-color: #272727;
}

.avatar_wrapper {
    position: relative;
    border-radius: 50%;
    min-width: 90px;
    min-height: 90px;
    max-width: 90px;
    max-height: 90px;
    background-color: #fff;
    transition: 200ms all ease;
}

.avatar_wrapper img {
    position: relative;
    border-radius: 50%;
    min-width: 90px;
    min-height: 90px;
    max-width: 90px;
    max-height: 90px;
    transition: 200ms all ease;
    object-fit: cover;
}

.account_info {
    margin-top: 20px;
    margin-bottom: 6px;
}

.account_info span {
    font-size: 18px;
    font-weight: 200;
}

.con_name {
    font-size: 15px;
    color: rgb(143, 143, 143);
}

.exit-acc-el {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 99999;
    color: #fff;
    opacity: 65%;
    transition: all 200ms ease;
}

.exit-acc-el:hover {
    opacity: 100%;
    cursor: pointer;
}

.avatar_wrapper:hover img {
    cursor: pointer;
    opacity: 20%;
}

.avatar_wrapper:hover .avatar_wrapper-change-avatar {
    cursor: pointer;
    z-index: 9999;
    opacity: 100% !important;
}

.avatar_wrapper-change-avatar {
    opacity: 0;
    color: #000000;
    font-size: 15px;
    font-weight: 400;
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    transition: 200ms all ease;
}
</style>