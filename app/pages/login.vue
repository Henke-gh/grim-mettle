<template>
    <CustomHeader />
    <section class="loginWrapper">
        <h1>Enter the Arena</h1>
        <div class="gradientBorder fitContent">
            <div class="loginContainer">
                <LoginForm />
            </div>
        </div>
        <div class="swordlineContainer spacing"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
        <div class="ctaRegister">
            <p class="customP">Don't have an account? It's free and only takes a moment to set up.</p>
            <DefaultButton text="Register new user" routeTo="/register" theme="light" />
        </div>
    </section>
    <CustomFooter />
</template>

<script setup>
</script>

<style scoped>
.loginWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    gap: 2rem;
}

.loginContainer {
    padding: 0.5rem;
    background-color: var(--bone-white);
}

.ctaRegister {
    background-color: var(--dark-green);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 1rem;
    padding-bottom: 1.5rem;
    color: var(--bone-white);
    border-radius: 5px;
    border: 5px double var(--bone-white);
}

.fitContent {
    width: fit-content;
}

.ctaRegister p {
    margin: 0;
}
</style>