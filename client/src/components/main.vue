<script>
import mainPage from '../pages/mainPage.vue'
import animeSerialCard from '../pages/animeSerialCard.vue'
import notFoundPage from '../pages/notFoundPage.vue'
import forum from '../pages/forum.vue'
import discussionPage from '../pages/discussionPage.vue'
import discussionCard from '../pages/discussionСard.vue'
export default {
    components: {
        mainPage,
        animeSerialCard,
        notFoundPage,
        forum,
        discussionPage,
        discussionCard
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
    <main>
        <router-view>
        </router-view>
    </main>
</template>

<style scoped>
main {
    margin-top: 100px;
    min-height: 100vh;
}
</style>