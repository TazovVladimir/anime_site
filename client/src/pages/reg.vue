<script>
import axios from 'axios'

export default {
    data() {
        return {
            name: '',
            login: '',
            password: '',
            file: '',
            isError: false,
            isDisabled: true
        };
    },
    methods: {
        async reg() {
            try {
                const file = this.$refs.fileInput.files[0];
                const formData = new FormData();
                console.log(file)
                formData.append('name', this.name);
                formData.append('login', this.login);
                formData.append('password', this.password);
                formData.append('avatar', file);

                const response = await axios.post('/register', formData);
                
                localStorage.setItem('token', response.data.token);
                this.isError = false;
                await this.$store.dispatch('setUserStatus');
                await this.$store.dispatch('setUserId');
                await this.$router.push('/account');
            } catch (error) {
                console.error(error);
                this.isError = true;
            }
        },
        validateInputs() {
            if (this.name.length >= 2 && this.login.length >= 2 && this.password.length >= 8) {
                this.isDisabled = false,
                    this.isError = false
            } else {
                this.isDisabled = true;
            }
        }
    },
    mounted() {
        const data = localStorage.getItem('token');
        if (data) {
            this.$router.push('/');

        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
};

</script>

<template>
    <section class="section-reg">
        <div class="reg">
            <p class="form-title">Регистрация на ANIFILM</p>
            <form @submit.prevent="reg">
                <div class="error" v-if="isError">
                    <span>Аккаунт уже существует</span>
                </div>
                <div class="form-item">
                    <label for="name">
                        <input @input="validateInputs" name="name" type="text" v-model="name" placeholder="Имя" required>
                        <span class="warning">*минимум 2 символа</span>
                    </label>
                </div>
                <div class="form-item">
                    <label for="img">
                        <input type="file" ref="fileInput" required accept="image/*">
                        <span class="warning">*.png, .jpg, .jpeg</span>
                    </label>
                </div>
                <div class="form-item">
                    <label for="login">
                        <input @input="validateInputs" name="login" type="text" v-model="login" placeholder="Логин"
                            required>
                        <span class="warning">*минимум 2 символа</span>
                    </label>
                </div>

                <div class="form-item">
                    <label for="password">
                        <input @input="validateInputs" name="password" type="password" v-model="password"
                            placeholder="Пароль" required>
                        <span class="warning">*минимум 8 символов</span>
                    </label>
                    <span>
                        <router-link tag="a" to="/login">У меня есть аккаунт</router-link>
                    </span>
                </div>

                <button :disabled="isDisabled" type="submit" class="btn">Войти</button>
            </form>
        </div>
    </section>
</template>
<style scoped>
.warning {
    font-size: 12px;
    color: rgb(255, 147, 147);
    opacity: 60%;
    font-weight: 200;
    margin-bottom: 0;
}

.error {
    width: 100%;
    background-color: rgb(248, 181, 181);
    margin-bottom: 20px;
    border-radius: 2px;
}

.error span {
    padding: 5px 0;
    text-align: center;
    font-size: 15px;
    font-weight: 400;
    color: rgb(136, 5, 5);
}

form {
    width: 275px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
}

.form-item {
    margin-bottom: 15px;
}

input {
    padding-left: 15px;
    width: 100%;
}

.form-title {
    font-size: 24px;
    font-weight: 400;
    color: #fff;
    margin-bottom: 20px;
    text-align: center;
}

span {
    margin: 10px 0;
    display: block;
    font-size: 12px;
    font-weight: 300;

}

.reg {
    position: relative;
}

.logo-li a img {
    width: 124px;
}

span a {
    color: #ABABAB;
}

span a:hover {
    opacity: 70%;
}
</style>