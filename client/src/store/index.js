import { createStore } from "vuex"
import axios from "axios"

const store = createStore({
    state() {
        return {
            user: false,
        }
    },
    mutations: {
        setUser(state) {
            state.user = true;
        },
        delUser(state) {
            state.user = false;
        },
    },
    actions: {
        setUserStatus({ commit }) {
            commit('setUser');
        },
        delUserStatus({ commit }) {
            commit('delUser');
        },
        setUserId() {
            const token = localStorage.getItem('token');
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            if (token) {
                localStorage.setItem('user_id', payload.token_id);
            }
        },
        delUserId(){
            localStorage.removeItem('user_id');
        }
    }
})

export default store;