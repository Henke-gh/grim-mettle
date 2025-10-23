<script setup>
definePageMeta({
    middleware: ["auth",],
});
import { capitalise } from "../../utils/general"

const { hero,
    heroAvatar,
    loading,
    error,
    mainAttributes,
    skills,
    inventoryWithItems,
    equippedItems,
    hasInventory,
    initialise,
    inventoryError,
    equipError,
    equipment,
    getItemById } = useHeroView();

onMounted(async () => {
    await initialise();
    console.log(equipment.value)
    console.log("LOG: ", equippedItems.value);
    console.log("Main hand item test:", getItemById(400)); // Test direct lookup
    console.log("Armour item test:", getItemById(401));
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
                <h4>Equipped Items:</h4>
                <p>Main hand: {{ equippedItems?.mainHand?.name || "- empty -" }}</p>
                <p>Off-hand: {{ equippedItems?.offHand?.name || "- empty -" }}</p>
                <p>Armour: {{ equippedItems?.armour?.name || "- empty -" }}</p>
                <h4>Trinkets:</h4>
                <p v-if="equippedItems?.trinkets.length === 0">- none -</p>
                <p v-for="(trinket, index) in equippedItems?.trinkets" :key="index">
                    {{ trinket.name }}
                </p>
            </div>
            <div class="part" v-if="!hasInventory">
                <h4>Inventory</h4>
                <p>-- Inventory empty --</p>
                <p v-if="inventoryError">{{ inventoryError }}</p>
            </div>
            <div class="part heroInventory" v-else>
                <h4>Inventory</h4>
                <p v-for="entry in inventoryWithItems" :key="entry.item_id">{{ entry.item.name }}</p>
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