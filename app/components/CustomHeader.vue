<template>
    <NuxtLink to="/" style="text-decoration: none; color: var(--warm-black); cursor: pointer;">
        <header>
            <img :src="grimLogo" alt="Grim Mettle" class="logo" />
            <p class="tagline">- Where heroes live forever -</p>
            <p class="tagline">Until they die.</p>
        </header>
    </NuxtLink>
</template>

<script setup>
import grimLogo from "../assets/images/logo.svg"
</script>

<style scoped>
header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--yellow);
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--dark-green);
}

.logo {
    height: auto;
    width: 18rem;
}

.tagline {
    margin: 0;
    margin-top: 0.2rem;
    font-size: 1.1rem;
    font-weight: 600;
}
</style>