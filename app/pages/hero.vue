<script setup>
definePageMeta({
    middleware: ["auth",],
});

const { hero, loading, error, fetchHero } = useHero();

onMounted(() => {
    fetchHero();
})
</script>

<template>
    <h1>Hero Overview</h1>
    <div v-if="loading">
        <h2>Loading hero..</h2>
    </div>
    <div v-else-if="error">
        <p>{{ error }}</p>
    </div>
    <div v-else-if="hero">
        <h2>{{ hero.hero_name }}</h2>
        <button @click="logoutUser">Sign Out</button>
        <HeroNav />
    </div>
</template>
