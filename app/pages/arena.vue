<template>
    <HeroCard />
    <div>
        Test
    </div>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
</script>

<style scoped></style>