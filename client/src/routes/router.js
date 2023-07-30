import { createRouter, createWebHistory } from "vue-router"
import mainPage from "../pages/mainPage.vue"
import animeSerialCard from '../pages/animeSerialCard.vue'
import notFoundPage from '../pages/notFoundPage.vue'
import animeSerialPage from '../pages/animeSerialPage.vue'
import animeFilmPage from '../pages/animeFilmPage.vue'
import login from '../pages/login.vue'
import reg from '../pages/reg.vue'
import account from '../pages/account.vue'
import forum from '../pages/forum.vue'
import discussionPage from '../pages/discussionPage.vue'
import discussionCard from '../pages/discussionСard.vue'


export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home', name: 'Главная страница', component: mainPage, alias: '/' },
        { path: '/anime-card/:id', component: animeSerialCard, name: 'Страница фильма' },
        { path: '/anime-serial', component: animeSerialPage },
        { path: '/anime-film', component: animeFilmPage },
        { path: '/login', component: login },
        { path: '/reg', component: reg },
        { path: '/account', component: account },
        { path: '/about', component: forum },
        { path: '/discussion', component: discussionPage },
        { path: '/discussion-card/:id', component: discussionCard },
        { path: '/:pathMatch(.*)*', name: 'Ссылки не существует', component: notFoundPage },

    ]
})
