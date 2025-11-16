<template>
    <HeroCard />
    <div class="healingWrapper">
        <h1>The Healer</h1>
        <img class="hospitalImg" src="../assets/images/hospital_small.png" alt="A view of Forhild's medicinal hut." />
        <article class="healingFlavourText">
            <h2 class="centerText">Forhild's Herbs and Splints</h2>
            <p>This is where the wounded go to recover and get patched up, if they have the gold to spare. </p>
        </article>
        <section class="healingItems">
            <h3>Forhild's Remedies</h3>
            <p v-if="successMessage">{{ successMessage }}</p>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <div class="healingShop" v-for="item in healingItems" :key="item.id">
                <div class="itemContainer">
                    <p class="bold">{{ item.name }}</p>
                    <p>Cost: {{ item.cost }} gold</p>
                </div>
                <div class="healingItems">
                    <div class="part">
                        <p>Recovery: {{ item.healingValue }} hp</p>
                        <button class="inspectViewBtn" v-on:click="buyHealing(item.id)">Buy</button>
                    </div>
                    <p class="italic">Description: {{ item.description }}</p>
                </div>
            </div>
        </section>
    </div>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
import { ref } from "vue";
import { healingItems } from "../../utils/healingItems";

const buyingHealing = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function buyHealing(item_id) {
    try {
        const payload = { item_id: item_id };
        await $fetch('/api/hero/buyHealing', { method: 'POST', body: payload })
        successMessage.value = 'Purchase Succesful'

        setTimeout(() => {
            window.location.reload();
        }, 700)
    } catch (err) {
        errorMessage.value = (err?.data?.message || err?.message || 'Purchase Failed')
    } finally {
        buyingHealing.value = false;
    }
}
</script>

<style scoped>
.healingWrapper {
    margin-top: 6.5rem;
    padding: 1rem;
    padding-bottom: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.hospitalImg {
    width: 15rem;
    height: auto;
}

.healingFlavourText {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.healingShop {
    border: 1px dotted var(--dark-green);
    padding: 0.5rem;
    border-radius: 5px;
}

.healingItems {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.itemContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;
}

.part {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.4rem;
}

@media only screen and (min-width: 650px) {
    .healingWrapper {
        margin-top: 1rem;
    }
}
</style>