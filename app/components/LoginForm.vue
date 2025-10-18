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
            <button class="loginBtn" :disabled="loading">
                {{ loading ? "Logging in..." : "Login" }}
            </button>
            <p v-if="error" class="text-red-400 mt-3 text-sm">{{ error }}</p>
            <p v-if="success" class="text-green-400 mt-3 text-sm">{{ success }}</p>
        </form>
    </section>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useSupabaseUser, useSupabaseClient } from "#imports";

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

// Automatically redirect logged-in users
watchEffect(() => {
    if (user.value) {
        router.push("/game");
    }
});

const submitLogin = async () => {
    error.value = "";
    success.value = "";
    loading.value = true;

    if (!email.value || password.value.length < 8) {
        error.value = "Invalid credentials.";
        loading.value = false;
        return;
    }

    try {
        const { session } = await $fetch("/api/auth/login", {
            method: "POST",
            body: { email: email.value, password: password.value },
        });

        if (session) {
            await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
            });
        }

        email.value = "";
        password.value = "";
    } catch (err) {
        error.value = err?.data?.message || "Something went wrong.";
    } finally {
        loading.value = false;
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