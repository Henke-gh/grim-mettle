<script setup>
definePageMeta({
    middleware: 'auth',
});

import { useHeroCreateStore } from "#imports";
import "../components/HeroCreationOne.vue"
import "../components/HeroCreationTwo.vue"

const hero = useHeroCreateStore();
</script>

<template>
    <CustomHeader />
    <HeroCreationOne v-if="hero.currentStep === 1" />
    <HeroCreationTwo v-else />
    <CustomFooter />
</template>

<style scoped></style>