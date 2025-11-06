<template>
    <CustomHeader />
    <div class="wrapper">
        <section class="loginWrapper">
            <h1>Enter the Arena</h1>
            <div class="gradientBorder fitContent">
                <div class="loginContainer">
                    <LoginForm />
                </div>
            </div>
            <div class="ctaRegister">
                <p class="customP">Don't have an account? It only takes a moment to set up.</p>
                <DefaultButton text="Register new user" routeTo="/register" theme="light" />
            </div>
        </section>
    </div>
    <CustomFooter />
</template>

<script setup>
</script>

<style scoped>
.loginWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
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
    gap: 0.5rem;
    padding: 0.5rem;
    padding-bottom: 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--bone-white);
    border-radius: 5px;
}

.fitContent {
    width: fit-content;
}

.ctaRegister p {
    margin: 0;
}
</style>