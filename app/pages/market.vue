<template>
    <HeroCard />
    <div class="wrapper">
        <div class="gradientBorder">
            <header class="storeHeader">
                <h1>Zorakh's Emporium</h1>
                <div class="headerStoreContainer">
                    <article>
                        <p>Browse around, have a look! I'm sure you'll find something you can afford.</p>
                        <p>A new trinket, perhaps? Or some protection?</p>
                    </article>
                    <img src="../assets/images/vendor.png" alt="The goblin vendor welcomes you." class="vendorImg" />
                </div>
            </header>
        </div>
        <section class="storeAwaits" v-if="!data">
            <h2>Waiting for inventory..</h2>
        </section>
        <section class="storeContainer" v-else>
            <div class="category">
                <h2>Weapons</h2>
                <div class="weaponCategory" v-for="weaponCategory in weaponCategories" :key="weaponCategory.key">
                    <button @click="toggleCategory(weaponCategory.key)" class="categoryToggle roboto-mono-600">
                        <span v-if="!isCategoryExpanded[weaponCategory.key]" class="toggleBtnContent">
                            <p>Show {{
                                weaponCategory.label
                            }}</p>
                            <img src="/ArrowDown.svg" alt="Arrow pointing down" />
                        </span>
                        <span v-else class="toggleBtnContent">
                            <p>Hide {{ weaponCategory.label }}</p>
                            <img src="/ArrowUp.svg" alt="Arrow point up" />
                        </span>
                    </button>
                    <div class="categoryList" v-if="isCategoryExpanded[weaponCategory.key]">
                        <div class="item" v-for="weapon in getWeaponsByCategory(weaponCategory.value)" :key="weapon.id">
                            <p>{{ weapon.name }}</p>
                            <div class="part">
                                <p>Cost: {{ weapon.goldCost }} gold</p>
                                <button class="inspectViewBtn bold" @click="openModal(weapon, 'weapons')">View</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="category">
                <h2>Shields</h2>
                <div class="item" v-for="shield in data.items.shields">
                    <p>{{ shield.name }}</p>
                    <div class="part">
                        <p>Cost: {{ shield.goldCost }} gold</p>
                        <button class="inspectViewBtn bold" @click="openModal(shield, shield.category)">View</button>
                    </div>
                </div>
            </div>
            <div class="category">
                <h2>Armour</h2>
                <div class="item" v-for="armour in data.items.armour">
                    <p>{{ armour.name }}</p>
                    <div class="part">
                        <p>Cost: {{ armour.goldCost }} gold</p>
                        <button class="inspectViewBtn bold" @click="openModal(armour, armour.category)">View</button>
                    </div>
                </div>
            </div>
            <div class="category">
                <h2>Trinkets</h2>
                <div class="item" v-for="trinket in data.items.trinkets">
                    <p>{{ trinket.name }}</p>
                    <div class="part">
                        <p>Cost: {{ trinket.goldCost }} gold</p>
                        <button class="inspectViewBtn bold" @click="openModal(trinket, trinket.category)">View</button>
                    </div>
                </div>
            </div>
        </section>
        <!-- Selling of items in Hero Inventory -->
        <section class="storeContainer">
            <div class="category" v-if="!hasInventory || unEquippedItems.length === 0">
                <h2>Your items:</h2>
                <p>No items to sell.</p>
            </div>
            <div class="category" v-else>
                <h2>Your items:</h2>
                <div class="item" v-for="entry in unEquippedItems" :key="entry.inventory_id">
                    <p>{{ entry.item.name }}</p>
                    <div class="part">
                        <p>Sell: {{ getResellValue(entry.item.goldCost) }} gold</p>
                        <button class="inspectViewBtn bold closeBtn" @click="sellItem(entry.inventory_id)"
                            :disabled="sellingItem">Sell</button>
                    </div>
                </div>
                <p v-if="sellingItem">Selling item..</p>
                <p v-if="successSaleMessage">{{ successSaleMessage }}</p>
            </div>
        </section>
    </div>
    <!-- === Buy Item Modal === -->
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
                    <p v-if="selectedItem.minDmg !== undefined"><strong>Damage:</strong> {{ selectedItem.minDmg }} - {{
                        selectedItem.maxDmg }}</p>
                    <p v-if="selectedItem.damageReduction !== undefined"><strong>Damage Reduction:</strong> {{
                        selectedItem.damageReduction }}</p>
                    <p v-if="selectedItem.blockValue !== undefined"><strong>Block Value:</strong> {{
                        selectedItem.blockValue
                    }}
                    </p>
                    <p v-if="selectedItem.weight"><strong>Weight:</strong> {{ selectedItem.weight ?? '—' }}</p>
                    <p v-if="selectedItem.strengthReq"><strong>Strength Req:</strong> {{ selectedItem.strengthReq ?? '—'
                    }}</p>
                    <p v-if="selectedItem.skillReq"><strong>Skill Req:</strong> <span
                            v-for="value, key in selectedItem.skillReq" :key="key"> {{ capitalise(key) }}: {{ value
                            }}</span></p>
                    <p v-if="Object.keys(selectedItem.bonus ?? {}).length"><strong>Bonus: </strong><span
                            v-for="value, key in selectedItem.bonus" :key="key"> {{ capitalise(key) }}: {{ value
                            }}</span>
                    </p>
                    <p><strong>Cost:</strong> {{ selectedItem.goldCost }} gold</p>
                    <p class="descriptionLine">{{ selectedItem.description }}</p>
                </section>
                <footer class="modalFooter">
                    <div class="modalFooterBtnContainer">
                        <button class="inspectViewBtn biggerBtn bold closeBtn" @click="closeModal"
                            :disabled="buyingItem">Close</button>
                        <button class="inspectViewBtn biggerBtn bold" @click="buyItem" :disabled="buyingItem">
                            <span v-if="!buyingItem">Buy</span>
                            <span v-else>Buying..</span>
                        </button>
                    </div>
                    <p v-if="errorMessage">{{ errorMessage }}</p>
                    <p v-if="successMessage">{{ successMessage }}</p>
                </footer>
            </div>
        </div>
    </teleport>

    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { capitalise } from '~~/utils/general';

const { data } = await useFetch('/api/items/itemCatalog');

/* === Item Display === */
const weaponCategories = [
    { key: 'swords', value: 'swords', label: 'Swords' },
    { key: 'axes', value: 'axes', label: 'Axes' },
    { key: 'hammers', value: 'hammers', label: 'Hammers' },
    { key: 'spears', value: 'spears', label: 'Spears' },
    { key: 'daggers', value: 'daggers', label: 'Daggers' },
];

const isCategoryExpanded = ref({
    swords: false,
    axes: false,
    hammers: false,
    spears: false,
    daggers: false
});

function toggleCategory(categoryKey) {
    isCategoryExpanded.value[categoryKey] = !isCategoryExpanded.value[categoryKey];
}

//Filter the items collection by weapon category
function getWeaponsByCategory(category) {
    return data.value?.items.weapons.filter(weapon => weapon.category === category) || [];
}

/* === Item Modal === */

const showModal = ref(false);
const selectedItem = ref({});
const selectedItemType = ref('');
const modalRef = ref(null);
const buyingItem = ref(false);
const sellingItem = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const successSaleMessage = ref('');

function openModal(item, itemType) {
    selectedItem.value = item || {}
    selectedItemType.value = itemType || ''
    errorMessage.value = ''
    successMessage.value = ''
    showModal.value = true
    //small delay to focus content
    setTimeout(() => modalRef.value?.focus?.(), 0)
}

function closeModal() {
    showModal.value = false
    selectedItem.value = {}
    selectedItemType.value = ''
    buyingItem.value = false
    errorMessage.value = ''
    successMessage.value = ''
}

async function buyItem() {
    if (buyingItem.value) return
    buyingItem.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    try {
        const payload = { id: selectedItem.value.id, itemType: selectedItemType.value };
        await $fetch('/api/hero/buyItem', { method: 'POST', body: payload })
        successMessage.value = 'Purchase Succesful'

        setTimeout(() => {
            closeModal()
            window.location.reload();
        }, 700)
    } catch (err) {
        errorMessage.value = (err?.data?.message || err?.message || 'Purchase Failed')
    } finally {
        buyingItem.value = false;
    }
}

function onKeydown(e) {
    if (e.key === 'Escape' && showModal.value) closeModal()
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));

/* ==== Selling Inventory ==== */
const { fetchInventory, fetchEquipment, inventoryWithItems, isEquipped, hasInventory } = useHeroView();

onMounted(async () => {
    await fetchInventory();
    await fetchEquipment();
})

//Sell item-section only shows currently unequipped items
const unEquippedItems = computed(() => {
    const items = unref(inventoryWithItems) || [];
    return items.filter(e => !isEquipped(e.inventory_id))
})

//Only for display purpose, actual value is set server-side.
function getResellValue(goldCost) {
    return Math.floor(goldCost * 0.55);
}

//Add sell-API route
async function sellItem(inventory_id) {
    if (sellingItem.value) return
    sellingItem.value = true;
    errorMessage.value = '';
    successSaleMessage.value = '';

    try {
        const payload = { inventory_id };
        await $fetch('/api/hero/sellItem', { method: 'POST', body: payload })
        successSaleMessage.value = 'Sale Succesful'

        setTimeout(() => {
            window.location.reload();
        }, 700)

    } catch (err) {
        errorMessage.value = (err?.data?.message || err?.message || 'Purchase Failed')
    } finally { sellingItem.value = false; }

}

</script>

<style scoped>
.wrapper {
    margin-top: 6.5rem;
    padding: 0.5rem;
    padding-bottom: 5rem;
}

.storeHeader {
    background-color: var(--bone-white);
    padding: 0.5rem;
    border-radius: 5px;
}

.storeHeader h1 {
    margin: 0;
}

.headerStoreContainer {
    display: flex;
    flex-direction: row;
}

.vendorImg {
    width: 7rem;
    height: auto;
    border-radius: 50%;
}

.categoryToggle {
    width: 100%;
    background-color: var(--brown);
    color: var(--bone-white);
    border: none;
    box-shadow: 2px 2px 2px var(--warm-black);
    padding: 0.4rem;
}

.toggleBtnContent {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.categoryList {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin: 1rem 0;
}

.item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.part {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.category {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 20rem;
    margin-top: 1rem;
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

.descriptionLine {
    font-style: italic;
}

.modalFooter {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-top: 0.75rem;
}

.modalFooterBtnContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

@media only screen and (min-width: 650px) {
    .wrapper {
        margin-top: 1rem;
    }

    .storeContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}
</style>