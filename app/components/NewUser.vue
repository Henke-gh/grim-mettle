<template>
    <section class="loginContainer">
        <h2>Create your Account</h2>
        <form @submit.prevent="submitForm">
            <div class="segment">
                <label for="usernameInput">Username: </label>
                <input type="text" id="usernameInput" v-model="username" placeholder="Enter username" min="3"
                    max="16" />
            </div>
            <div class="segment">
                <label for="emailInput">Enter e-mail: </label>
                <input type="text" id="emailInput" v-model="email" placeholder="Enter e-mail" />
            </div>
            <div class="segment">
                <label for="passwordInput">Choose a password: </label>
                <input type="password" id="passwordInput" v-model="password" placeholder="Choose password" min="8" />
            </div>
            <div class="segment">
                <label for="repeatPasswordInput">Repeat password: </label>
                <input type="password" id="repeatPasswordInput" v-model="repeatPassword" placeholder="Repeat password"
                    min="8" />
            </div>
            <button class="loginBtn" :disabled="loading">{{ loading ? 'Registering...' : 'Register' }}</button>
            <p v-if="error" class="text-red-400 mt-3 text-sm">{{ error }}</p>
            <p v-if="success" class="text-green-400 mt-3 text-sm">{{ success }}</p>
        </form>
    </section>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const submitForm = async () => {
    loading.value = true
    error.value = ''
    success.value = ''
    if (password.value !== repeatPassword.value) {
        error.value = "Passwords don't match. Please try again."
        loading.value = false
    } else {
        try {
            const res = await $fetch('/api/auth/register', {
                method: 'POST',
                body: { username: username.value, email: email.value, password: password.value }
            })
            success.value = res.message
            username.value = ''
            email.value = ''
            password.value = ''
        } catch (err) {
            error.value = err?.data?.message || 'Something went wrong'
        }

        loading.value = false
    }
}
</script>

<style scoped>
.loginContainer {
    display: flex;
    flex-direction: column;
    justify-self: center;
    max-width: 19rem;
    background-color: var(--light-green);
    padding: 1rem;
    border-radius: 5px;
}

.segment {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 0.3rem;
}

.loginBtn {
    width: fit-content;
}
</style>