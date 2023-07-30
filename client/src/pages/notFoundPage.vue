<script>
</script>
<template>
    <section class="not_found_wrapper">
        <div class="container">
            <div class="wrapper">
                <img src="../img/404/img.png" alt="404">
                <div class="error">
                    <span class="error_404">404</span>
                    <p class="error_msg">А вот и нет страницы, возвращайся <span><router-link class="back" to="/home">обратно</router-link></span></p>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
.not_found_wrapper{
    padding: 30px 0;
}
.error{
    width: 400px;
    background-color: #2F2F2F;
    padding: 40px;
    padding-top: 100px;
    border-radius: 10px;
}
img{
    width: 250px;
    height: auto;
}
.error_404{
    display: block;
    text-align: center;
    color: #fff;
    font-size: 90px;
    font-weight: 600;
    margin-bottom: 10px;
}
.error_msg{
    text-align: center;
    color: rgb(170, 170, 170);
    font-size: 26px;
    font-weight: 300;
}
.wrapper{
    display: flex;
    width: 700px;
    justify-content: space-between;
    margin: 0 auto;
}
.back{
    color: #007DFFDE;
}
</style>