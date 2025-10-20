<template>
    <CustomHeader />
    <div class="wrapper">
        <h1>Registration</h1>
        <div class="gradientBorder">
            <NewUser />
        </div>
        <article>
            <h3>Verifying your account</h3>
            <p>Upon registering your new account you will recieve an e-mail with a confirmation link.</p>
            <h3>Email & Username</h3>
            <p>Your e-mail will only be used as part of your login credentials and is never publicly displayed.</p>
            <p>Username is not used for login but might be displayed in certain game contexts, such as leaderboards.</p>
        </article>
    </div>
    <CustomFooter />
</template>

<script setup>
import "../components/CustomFooter.vue"
import "../components/CustomHeader.vue"
import "../components/NewUser.vue"
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

article {
    max-width: 20rem;
}
</style>