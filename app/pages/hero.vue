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
    <div v-if="loading" class="heroWrapper">
        <h1>Hero Overview</h1>
        <h2>Loading hero..</h2>
    </div>
    <div v-else-if="error" class="heroWrapper">
        <p>{{ error }}</p>
    </div>
    <div v-else-if="hero" class="heroWrapper">
        <div class="heroHead">
            <h1>{{ hero.hero_name }} - Level: {{ hero.level }}</h1>
        </div>
        <div class="gradientBorder">
            <section class="overviewContainer">
                <div class="part">
                    <img :src="heroAvatar.src" :alt="heroAvatar.alt" class="heroPortrait" />
                </div>
                <div class="part">
                    <p>HP: {{ hero.hp_current }}/{{ hero.hp_max }}</p>
                    <p>Grit: {{ hero.grit_current }}/{{ hero.grit_max }}</p>
                    <p>XP: {{ hero.xp }}/{{ hero.xp_next_lvl }}</p>
                    <p>Gold: {{ hero.gold }}</p>
                </div>
            </section>
        </div>
        <section class="itemContainer">
            <h3>Items</h3>
            <div class="part">
                <h4>Equipped</h4>
                <p>Main hand: Short Sword</p>
                <p>Off-hand: -empty-</p>
                <p>Armour: Rag Tunic</p>
                <p>Trinkets:</p>
            </div>
            <div class="part">
                <h4>Inventory</h4>
                <p>Buckler</p>
                <p>Jade Ring</p>
            </div>
        </section>
        <section class="skillWrapper">
            <h3>Attributes & Skills</h3>
            <div class="skillContainer">
                <div class="part">
                    <h4>Main Attributes</h4>
                    <p class="skills" v-for="(value, key) in mainAttributes">{{ capitalise(key) }}: {{ value }}</p>
                </div>
                <div class="part">
                    <h4>Skills</h4>
                    <p class="skills" v-for="(value, key) in skills">{{ capitalise(key) }}: {{ value }}
                    </p>
                </div>
            </div>
        </section>
        <button @click="logoutUser" style="width: fit-content;">Sign Out</button>
    </div>
    <HeroNav />
</template>

<style scoped>
.heroWrapper {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.5rem;
}

.heroContainer {
    background-color: var(--bone-white);
    border: 2px solid var(--dark-green);
    padding: 0.5rem;
}

.overviewContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--bone-white);
    border-radius: 5px;
}

.itemContainer {
    display: flex;
    flex-direction: column;
    border: 2px solid var(--dark-green);
    padding: 0.5rem;
    gap: 0.5rem;
}

.skillWrapper {
    display: flex;
    flex-direction: column;
    background-color: var(--bone-white);
    border: 2px solid var(--dark-green);
    padding: 0.5rem;
    gap: 0.5rem
}

.skillContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.heroHead {
    width: 100%;
    padding: 0.5rem;
    background-color: var(--yellow);
}
</style>