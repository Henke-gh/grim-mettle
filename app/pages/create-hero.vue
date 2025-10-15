<script setup>
import { useHeroCreateStore } from "#imports";
import "../components/HeroCreationOne.vue"
import "../components/HeroCreationTwo.vue"

const hero = useHeroCreateStore();
</script>

<template>
    <section>
        <HeroCreationOne v-if="hero.currentStep === 1" />
        <HeroCreationTwo v-else />
    </section>
</template>

<style scoped></style>