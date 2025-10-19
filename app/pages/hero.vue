<script setup>
definePageMeta({
    middleware: ["auth",],
});

const { hero, loading, error, fetchHero } = useHero();

onMounted(() => {
    fetchHero();
})

function handleCreate() {
    navigateTo('/create-hero')
}
</script>

<template>
    <div v-if="loading">
        <h1>Loading hero..</h1>
    </div>
    <div v-else-if="error">
        <p>{{ error }}</p>
    </div>
    <div v-else-if="hero">
        <h1>Hero Overview</h1>
        <h2>{{ hero.hero_name }}</h2>
        <button @click="handleCreate">Create new Hero</button>
        <button @click="logoutUser">Sign Out</button>
    </div>
</template>
