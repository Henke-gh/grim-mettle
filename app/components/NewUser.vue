<template>
    <section class="loginContainer">
        <h2>Choose a username:</h2>
        <div class="segment">
        <label for="usernameInput">Username: </label>
        <input type="text" id="usernameInput" v-model="username"/>
        </div>
        <div class="segment">
        <label for="passwordInput">Choose a password: </label>
        <input type="text" id="passwordInput" v-model="password"/>
        </div>
        <div class="segment">
        <label for="repeatPasswordInput">Repeat password: </label>
        <input type="text" id="repeatPasswordInput" v-model="repeatPassword"/>
        </div>
        <button class="loginBtn">Register</button>
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