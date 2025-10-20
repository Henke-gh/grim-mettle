<script setup>
definePageMeta({
    middleware: ["auth",],
});
import { capitalise } from "../../utils/general"
const { hero, heroAvatar, derivedStats, loading, error, fetchHero } = useHero();
onMounted(() => {
    fetchHero();
})

const mainAttributes = computed(() => {
    if (!hero.value) return null
    return {
        strength: hero.value.strength,
        speed: hero.value.speed,
        vitality: hero.value.vitality
    }
})

const skills = computed(() => {
    if (!hero.value || !derivedStats.value) return null
    const allSkills = {
        swords: hero.value.swords,
        axes: hero.value.axes,
        hammers: hero.value.hammers,
        spears: hero.value.spears,
        daggers: hero.value.daggers,
        block: derivedStats.value.trueBlock,
        evasion: derivedStats.value.trueEvasion,
        initiative: derivedStats.value.trueInitiative
    }
    //Converts to an array, filters out skills with a value of 0,
    //converts back to an object and returns filtered list to reduce bloat on hero overview page
    return Object.fromEntries(
        Object.entries(allSkills).filter(([_, value]) => value > 0)
    )
})

</script>

<template>
    <div class="wrapper">
        <h1>Hero Overview</h1>
        <div v-if="loading">
            <h2>Loading hero..</h2>
        </div>
        <div v-else-if="error">
            <p>{{ error }}</p>
        </div>
        <div v-else-if="hero">
            <section class="container">
                <div class="part">
                    <img :src="heroAvatar.src" :alt="heroAvatar.alt" class="heroPortrait" />
                </div>
                <div class="part">
                    <h3>{{ hero.hero_name }} [Level: {{ hero.level }}]</h3>
                    <p>HP: {{ hero.hp_current }}/{{ hero.hp_max }}</p>
                    <p>Grit: {{ hero.grit_current }}/{{ hero.grit_max }}</p>
                    <p>XP: {{ hero.xp }}/{{ hero.xp_next_lvl }}</p>
                    <p>Gold: {{ hero.gold }}</p>
                </div>
            </section>
            <section class="container">
                <div class="part">
                    <h4>Main Attributes</h4>
                    <p class="skills" v-for="(value, key) in mainAttributes">{{ capitalise(key) }}: {{ value }}</p>
                </div>
                <div class="part">
                    <h4>Skills</h4>
                    <p class="skills" v-for="(value, key) in skills">{{ capitalise(key) }}: {{ value }}
                    </p>
                </div>
            </section>
            <button @click="logoutUser">Sign Out</button>
        </div>
    </div>
    <HeroNav />
</template>

<style scoped>
.wrapper {
    padding: 0.5rem;
}

.container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
</style>