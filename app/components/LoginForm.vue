<template>
    <section class="loginContainer">
        <h2>Login</h2>
        <div class="segment">
        <label for="usernameInput">Username: </label>
        <input type="text" id="usernameInput" v-model="username"/>
        </div>
        <div class="segment">
        <label for="passwordInput">Password: </label>
        <input type="text" id="passwordInput" v-model="password"/>
        </div>
        <button class="loginBtn">Login</button>
        <p>Register new user</p>
    </section>
</template>

<script setup>

</script>

<style scoped>
.loginContainer {
    display: flex;
    flex-direction: column;
}
.segment {
    display: flex;
    flex-direction: row;
}
.loginBtn{
    width: fit-content;
}
</style>