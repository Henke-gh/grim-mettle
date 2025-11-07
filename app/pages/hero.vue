<script setup>
definePageMeta({
    middleware: ["auth",],
});
import { capitalise } from "../../utils/general"
import { computed, unref } from "vue";

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
    actionError,
    actionLoading,
    actionSuccess,
    unequipItem,
    equipItem,
    canEquip,
    isEquipped,
    fetchHero,
    canLevelUp, totalFights, winRatio } = useHeroView();

const { checkAndTriggerRegen } = useRegenCheck();

onMounted(async () => {
    await initialise();
    const response = await checkAndTriggerRegen(hero.value);

    if (response?.regenerated) {
        await fetchHero();
    }
})

//Inventory only shows currently unequipped items
const unEquippedItems = computed(() => {
    const items = unref(inventoryWithItems) || [];
    return items.filter(e => !isEquipped(e.inventory_id))
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
    <div v-if="hero" class="heroHead">
        <h1>{{ hero.hero_name }} - Level: {{ hero.level }}</h1>
        <GameNav />
    </div>
    <div v-if="hero" class="heroWrapper">
        <div class="gradientBorder">
            <section class="overviewContainer">
                <div class="part">
                    <img :src="heroAvatar.src" :alt="heroAvatar.alt" class="heroPortrait" />
                </div>
                <div class="levelUp bold" v-if="canLevelUp">
                    <p>You&apos;ve gained a level!</p>
                    <DefaultButton theme="default" text="Level Up" routeTo="/level-up" />
                </div>
                <div class="part" v-if="!canLevelUp">
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
                <div class="equippedItem">
                    <p>Main hand: {{ equippedItems?.mainHand?.name || "- empty -" }}</p>
                    <button v-if="equippedItems?.mainHand?.name" @click="unequipItem('main_hand')"
                        :disabled="actionLoading" class="inspectViewBtn closeBtn bold">Unequip</button>
                </div>
                <div class="equippedItem">
                    <p>Off-hand: {{ equippedItems?.offHand?.name || "- empty -" }}</p>
                    <button v-if="equippedItems?.offHand?.name" @click="unequipItem('off_hand')"
                        :disabled="actionLoading" class="inspectViewBtn closeBtn bold">Unequip</button>
                </div>
                <div class="equippedItem">
                    <p>Armour: {{ equippedItems?.armour?.name || "- empty -" }}</p>
                    <button v-if="equippedItems?.armour?.name" @click="unequipItem('armour')" :disabled="actionLoading"
                        class="inspectViewBtn closeBtn bold">Unequip</button>
                </div>
                <h4>Trinkets:</h4>
                <p v-if="equippedItems?.trinkets.length === 0">- none -</p>
                <div class="equippedItem" v-for="(trinket, index) in equippedItems?.trinkets" :key="index">
                    <p>{{ trinket.name }}</p>
                    <button v-if="equippedItems?.trinkets[index]" @click="unequipItem('trinket_' + (index + 1))"
                        :disabled="actionLoading" class="inspectViewBtn closeBtn bold">Unequip</button>
                </div>
            </div>
            <div class="part" v-if="!hasInventory || unEquippedItems.length === 0">
                <h4>Inventory</h4>
                <p>-- Inventory empty --</p>
                <p v-if="inventoryError">{{ inventoryError }}</p>
            </div>
            <div class="part heroInventory" v-else>
                <h4>Inventory</h4>
                <div class="equippedItem" v-for="entry in inventoryWithItems" :key="entry.inventory_id">
                    <p v-if="!isEquipped(entry.inventory_id)">{{ entry.item.name }}</p>
                    <button v-if="!isEquipped(entry.inventory_id)"
                        @click="equipItem(entry.item_id, entry.inventory_id, entry.item.slot)"
                        :disabled="actionLoading || !canEquip(entry.item)" class="inspectViewBtn bold"
                        :class="{ 'disabled': !canEquip(entry.item) }">
                        {{ canEquip(entry.item) ? 'Equip' : 'Requirements not met' }}
                    </button>
                </div>
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
        <section class="skillWrapper">
            <h3>Combat Stats</h3>
            <div class="skillContainer">
                <div class="part alignedCenter">
                    <h4>Wins</h4>
                    <p>{{ hero.wins }}</p>
                </div>
                <div class="part alignedCenter">
                    <h4>Losses</h4>
                    <p>{{ hero.losses }}</p>
                </div>
                <div class="part alignedCenter">
                    <h4>Total</h4>
                    <p>{{ totalFights }}</p>
                </div>
                <div class="part alignedCenter">
                    <h4>Win Ratio</h4>
                    <p>{{ winRatio }}%</p>
                </div>
            </div>
        </section>
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

.heroHead {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem;
    background-color: var(--yellow);
    border-bottom: 5px double var(--bone-white);
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
    gap: 3rem;
}

.itemContainer {
    display: flex;
    flex-direction: column;
    border: 2px solid var(--dark-green);
    padding: 0.5rem;
    gap: 0.5rem;
}

.part {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.alignedCenter {
    align-items: center;
}

.equippedItem {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 18rem;
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

.levelUp {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}
</style>