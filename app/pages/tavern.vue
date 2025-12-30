<template>
    <HeroCard />
    <div class="tavernWrapper">
        <h1 class="centerText">The Flying Goat's Head</h1>
        <img class="tavernImg" src="../assets/images/tavernkeeper.png" alt="An image of the barkeep at the Tavern" />
        <article class="tavernFlavourText">
            <p>This mess of a place is Borkh's tavern. It's not for the faint of heart, or those with sensitive
                stomachs.</p>
            <p>You can find work here, if you're willing. It's of the hard kind, and the pay isn't very good. But every
                little bit helps right?</p>
        </article>
        <section class="tavernWork">
            <h3>Legitimate Honest Work</h3>
            <p v-if="successMessage" class="shift-success">{{ successMessage }}</p>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <div class="tavernOptions" v-for="shift in tavernShifts" :key="shift.id">
                <div class="shiftContainer">
                    <p class="bold">{{ shift.name }}</p>
                </div>
                <div class="tavernShift">
                    <p>Spend: {{ shift.gritCost }} grit</p>
                    <div class="part">
                        <p>Receive: {{ shift.payout }} gold</p>
                        <button class="inspectViewBtn" v-on:click="workShift(shift.id)">Work</button>
                    </div>
                </div>
            </div>
        </section>
        <div class="swordlineContainer spacing"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" />
        </div>
    </div>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
import { tavernShifts } from "../../utils/tavernShifts";
import { ref } from "vue";

const { hero, fetchHero } = useHero();
const workingShift = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function workShift(shift_id) {
    try {
        const payload = { shift_id: shift_id };
        const response = await $fetch('/api/hero/tavernWork', { method: 'POST', body: payload })
        const payment = response?.payout;
        successMessage.value = 'Work Completed! You earned ' + payment + ' gold.';

        await fetchHero();

        setTimeout(() => {
            successMessage.value = '';
        }, 3000)
    } catch (err) {
        errorMessage.value = (err?.data?.message || err?.message || 'Tavern work failed.')
    } finally {
        workingShift.value = false;
    }
}
</script>

<style scoped>
.tavernWrapper {
    margin-top: 6.5rem;
    padding: 0.5rem;
    padding-bottom: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.tavernImg {
    width: 20rem;
    height: auto;
    margin-top: 0.5rem;
}

.tavernWork {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.tavernFlavourText {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
}

.tavernOptions {
    border: 1px dotted var(--dark-green);
    padding: 0.5rem;
    border-radius: 5px;
}

.tavernShift {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
}

.part {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
}

.shift-success {
    font-size: 1rem;
    font-weight: 600;
}

@media only screen and (min-width: 650px) {
    .tavernWrapper {
        margin-top: 1rem;
    }
}
</style>