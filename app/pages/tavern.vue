<template>
    <HeroCard />
    <div class="tavernWrapper">
        <h1>Tavern</h1>
        <h2>Closed until further notice.</h2>
    </div>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
</script>

<style scoped>
.tavernWrapper {
    margin-top: 6.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>