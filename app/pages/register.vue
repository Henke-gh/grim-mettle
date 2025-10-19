<template>
    <CustomHeader />
    <div class="wrapper">
        <h1>Registration</h1>
        <div class="borderBgGradient">
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

.borderBgGradient {
    background: #eb39f5;
    background: linear-gradient(24deg,
            rgba(235, 57, 245, 1) 0%,
            rgba(56, 245, 207, 1) 50%,
            rgba(245, 201, 56, 1) 100%);
    padding: 0.2rem;
    border-radius: 5px;
}

article {
    max-width: 20rem;
}
</style>