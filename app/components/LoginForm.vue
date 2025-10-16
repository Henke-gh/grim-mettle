<template>
    <section class="loginContainer">
        <h2>Login</h2>
        <form class="loginForm" @submit.prevent="submitLogin">
            <div class="segment">
                <label for="emailInput">E-mail: </label>
                <input type="email" id="emailInput" v-model="email" required />
            </div>
            <div class="segment">
                <label for="passwordInput">Password: </label>
                <input type="password" id="passwordInput" v-model="password" required />
            </div>
            <button class="loginBtn">Login</button>
            <p v-if="error" class="text-red-400 mt-3 text-sm">{{ error }}</p>
            <p v-if="success" class="text-green-400 mt-3 text-sm">{{ success }}</p>
        </form>
    </section>
</template>

<script setup>
import { ref } from 'vue'
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');

const submitLogin = async () => {
    error.value = '';

    if (password.value.length < 8 || !email.value) {
        error.value = 'Invalid Credentials.';
        return;
    }

    try {
        const res = await $fetch('/api/auth/login', {
            method: 'POST',
            body: { email: email.value, password: password.value },
            onResponseError({ response }) {
                error.value = response._data?.message || 'Invalid Credentials.'
            }
        });

        success.value = res.message;
        email.value = '';
        password.value = '';

        router.push('/game');
    } catch (error) {
        error.value = error?.data?.message || 'Something went wrong';
    }
};

</script>

<style scoped>
.loginContainer {
    display: flex;
    flex-direction: column;
}

.loginForm {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.segment {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.2rem
}

.loginBtn {
    width: fit-content;
}
</style>