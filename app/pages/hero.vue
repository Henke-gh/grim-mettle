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
});

/* === Item Modal === */

const showModal = ref(false);
const selectedItem = ref({});
const selectedItemType = ref('');
const modalRef = ref(null);

function openModal(item, itemType) {
    selectedItem.value = item || {}
    selectedItemType.value = itemType || ''
    showModal.value = true
    //small delay to focus content
    setTimeout(() => modalRef.value?.focus?.(), 0)
}

function closeModal() {
    showModal.value = false
    selectedItem.value = {}
    selectedItemType.value = ''
}

function onKeydown(e) {
    if (e.key === 'Escape' && showModal.value) closeModal()
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
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
            <h3>Items <span class="italic" style="font-size: 0.75rem;">- Click an item to inspect it.</span></h3>
            <div class="part">
                <h4>Equipped Items:</h4>
                <div class="equippedItem">
                    <p v-if="equippedItems?.mainHand"
                        @click="openModal(equippedItems?.mainHand, equippedItems?.mainHand?.category)"
                        style="cursor: pointer;">
                        Main hand: {{ equippedItems?.mainHand?.name }}
                    </p>
                    <p v-else>Main hand: - empty -</p>
                    <button v-if="equippedItems?.mainHand?.name" @click="unequipItem('main_hand')"
                        :disabled="actionLoading" class="inspectViewBtn closeBtn bold">Unequip</button>
                </div>
                <div class="equippedItem">
                    <p v-if="equippedItems?.offHand"
                        @click="openModal(equippedItems?.offHand, equippedItems?.offHand?.category)"
                        style="cursor: pointer;">
                        Off-hand: {{ equippedItems?.offHand?.name }}</p>
                    <p v-else>Off-hand: - empty -</p>
                    <button v-if="equippedItems?.offHand?.name" @click="unequipItem('off_hand')"
                        :disabled="actionLoading" class="inspectViewBtn closeBtn bold">Unequip</button>
                </div>
                <div class="equippedItem">
                    <p v-if="equippedItems?.armour"
                        @click="openModal(equippedItems?.armour, equippedItems?.armour?.category)"
                        style="cursor: pointer;">
                        Armour: {{ equippedItems?.armour?.name }}</p>
                    <p v-else>Armour: - empty -</p>
                    <button v-if="equippedItems?.armour?.name" @click="unequipItem('armour')" :disabled="actionLoading"
                        class="inspectViewBtn closeBtn bold">Unequip</button>
                </div>
                <h4>Trinkets:</h4>
                <p v-if="equippedItems?.trinkets.length === 0">- none -</p>
                <div class="equippedItem" v-for="(trinket, index) in equippedItems?.trinkets" :key="index">
                    <p @click="openModal(trinket.item, trinket.item.category)" style="cursor: pointer;">
                        {{ trinket.item.name }}</p>
                    <button v-if="equippedItems?.trinkets[index]" @click="unequipItem(trinket.slot)"
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
                <div class="equippedItem" v-for="entry in unEquippedItems" :key="entry.inventory_id">
                    <p @click="openModal(entry.item, entry.item.category)" style="cursor: pointer;">
                        {{ entry.item.name }}</p>
                    <button @click="equipItem(entry.item_id, entry.inventory_id, entry.item.slot)"
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

        <!-- === View Item Modal === -->
        <teleport to="body">
            <div v-if="showModal" class="modalOverlay" @click.self="closeModal" role="dialog" aria-modal="true"
                :aria-label="selectedItem?.name || 'Item details'">
                <div class="modalContent" ref="modalRef">
                    <header class="modalHeader">
                        <h3>{{ selectedItem.name }}</h3>
                        <button class="closeByXBtn" @click="closeModal" aria-label="Close">&times;</button>
                    </header>
                    <section class="modalBody">
                        <p><strong>Category:</strong> {{ capitalise(selectedItem.category) || '—' }}</p>
                        <p v-if="selectedItem.minDmg !== undefined"><strong>Damage:</strong> {{ selectedItem.minDmg }} -
                            {{
                                selectedItem.maxDmg }}</p>
                        <p v-if="selectedItem.damageReduction !== undefined"><strong>Damage Reduction:</strong> {{
                            selectedItem.damageReduction }}</p>
                        <p v-if="selectedItem.blockValue !== undefined"><strong>Block Value:</strong> {{
                            selectedItem.blockValue
                            }}
                        </p>
                        <p v-if="selectedItem.weight"><strong>Weight:</strong> {{ selectedItem.weight ?? '—' }}</p>
                        <p v-if="selectedItem.strengthReq"><strong>Strength Req:</strong> {{ selectedItem.strengthReq ??
                            '—'
                            }}</p>
                        <p v-if="selectedItem.skillReq"><strong>Skill Req:</strong> <span
                                v-for="value, key in selectedItem.skillReq" :key="key"> {{ capitalise(key) }}: {{ value
                                }}</span></p>
                        <template v-if="Object.keys(selectedItem.bonus ?? {}).length">
                            <p><strong>Bonus:</strong>
                                <li style="list-style-type: none;" v-for="value, key in selectedItem.bonus" :key="key">
                                    {{
                                        capitalise(key) }}: {{ value
                                    }}</li>
                            </p>
                        </template>
                        <p class="descriptionLine">{{ selectedItem.description }}</p>
                    </section>
                    <div v-if="selectedItem.image.src" class="itemImgContainer">
                        <img :src="selectedItem.image.src" :alt="selectedItem.image.alt" class="itemImg"
                            style="height: auto; width: 8rem;" />
                    </div>
                    <footer class="modalFooter">
                        <div class="modalFooterBtnContainer">
                            <button class="inspectViewBtn biggerBtn bold closeBtn" @click="closeModal">Close</button>
                        </div>
                    </footer>
                </div>
            </div>
        </teleport>
    </div>
    <HeroNav />
</template>

<style scoped>
.heroWrapper {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    padding-bottom: 5rem;
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
    width: 20rem;
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
    text-align: center;
    gap: 0.5rem;
}

/* MODAL STYLING */
.modalOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 60;
    padding: 1rem;
}

.modalContent {
    background: var(--bone-white);
    color: var(--dark-green);
    width: min(90%, 640px);
    max-height: 90vh;
    overflow: auto;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    outline: none;
    padding: 1rem;
}

.modalHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--brown);
}

.closeByXBtn {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--dark-green);
}

.modalBody p {
    margin: 0.4rem 0;
}

.itemImgContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0.5rem 0rem;
}

.descriptionLine {
    font-style: italic;
}

.modalFooter {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px dashed var(--brown);
}

.modalFooterBtnContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 0.5rem;
}

@media only screen and (min-width: 650px) {
    .heroWrapper {
        min-width: 650px;
    }
}
</style>