<template>
    <div class="wrapper">
        <section class="loginWrapper">
            <div class="swordsContainer">
                <img :src="swords" alt="Two crossed swords" class="swordsImg" />
            </div>
            <div class="loginContainer">
                <LoginForm />
            </div>
        </section>
        <div class="ctaRegister">
            <NuxtLink to="/register" style="text-decoration: none; color: var(--bone-white); cursor: pointer;">
                <p>[Register new user]</p>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.loginWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: var(--light-green);
}

.swordsContainer {
    background-color: var(--dark-green);
    border-radius: 50%;
    padding: 0.2rem;
    border: 3px dashed var(--yellow);
}

.swordsImg {
    height: 4.5rem;
    width: auto;
}

.ctaRegister {
    background-color: var(--dark-green);
    text-align: center;
    padding: 0.4rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--bone-white);
}

.ctaRegister p {
    margin: 0;
}
</style>