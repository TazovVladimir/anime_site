<script>
</script>

<template>
    <footer>
        <div class="container">
            <div class="footer_wrapper">
                <div class="footer_logo">
                    <a href="footer_logo_a">
                        <img src="../icons/logo.svg" alt="footer_logo" width="110px">
                    </a>
                </div>
                <ul class="footer_ul_wrapper">
                    <li class="footer_ul_item">
                        <a href="/home" class="footer_ul_item_a">
                            Главная
                        </a>
                    </li>
                    <li class="footer_ul_item">
                        <a href="/about" class="footer_ul_item_a">
                            Аниме
                        </a>
                    </li>
                    <li class="footer_ul_item">
                        <a href="/anime-serial" class="footer_ul_item_a">
                            Сериалы
                        </a>
                    </li>
                    <li class="footer_ul_item">
                        <a href="/anime-film" class="footer_ul_item_a">
                            Фильмы
                        </a>
                    </li>
                    <li class="footer_ul_item">
                        <a href="/discussion" class="footer_ul_item_a">
                            Обсуждения
                        </a>
                    </li>
                </ul>
                <span class="copyright">
                    © anifilm 2023
                </span>
            </div>
        </div>
    </footer>
</template>

<style scoped>
footer {
    background-color: #171717;
    padding: 30px 0;
}

.footer_wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.footer_logo{
    margin-bottom: 20px;
}
.footer_ul_wrapper {
    display: flex;
}

.footer_ul_item {
    margin-right: 30px;
}
.footer_ul_item:last-child {
    margin-right: 0;
}

.footer_ul_item_a {
    font-size: 16px;
    color: #929292;
    font-weight: 300;
}

.footer_ul_item_a:hover {
    color: #fff;
}
.copyright{
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    color: #818181;
}
</style>