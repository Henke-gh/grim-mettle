<template>
    <CustomHeader />
    <div class="recordsWrapper">
        <h1>Hall of Records</h1>
        <p class="textLeft">The bureaucrats of this world need to make a living somehow. Thus records are kept, of those
            still fighting
            and of those who are not.</p>
        <div class="swordlineContainer spacing"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
        <section class="recordsContainer">
            <h2>The Favoured Living</h2>
            <h3 class="italic">Champions and absolute tossers.</h3>
            <table class="recordTable" v-if="leaderboard">
                <thead>
                    <tr class="recordHeader">
                        <th scope="col">Name</th>
                        <th scope="col">Level</th>
                        <th scope="col">Total XP</th>
                    </tr>
                </thead>
                <tr v-for="hero in leaderboard" :key="hero.id">
                    <th scope="row">{{ hero.hero_name }}</th>
                    <td>{{ hero.level }}</td>
                    <td>{{ hero.xp }}</td>
                </tr>
            </table>
            <div class="swordlineContainer spacing"><img src="/divider.svg"
                    alt="A line of four swords, with a shield in the middle" /></div>
            <h2>The Graveyard</h2>
            <h3 class="italic">Where the fallen are remembered.</h3>
            <table class="recordTable" v-if="fallenHeroes">
                <thead class="recordHeader">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Level</th>
                        <th scope="col">Total XP</th>
                    </tr>
                </thead>
                <tr v-for="rip in fallenHeroes" :key="rip.id">
                    <th scope="row">{{ rip.hero_name }}</th>
                    <td>{{ rip.hero_lvl }}</td>
                    <td>{{ rip.hero_xp }}</td>
                </tr>
            </table>
            <p v-if="errorMsg">{{ errorMsg }}</p>
        </section>
        <div class="swordlineContainer spacing"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
    </div>
    <HeroNav v-if="hero.id" />
    <CustomFooter v-else />
</template>

<script setup>
import { useHeroView } from '#imports';
import CustomFooter from '~/components/CustomFooter.vue';

const hero = useHeroView();
const fallenHeroes = ref([]);
const leaderboard = ref([]);
const errorMsg = ref('');

async function getLeaderboard() {
    errorMsg.value = '';

    try {
        return await $fetch('/api/leaderboard', {
            method: 'GET'
        })
    } catch (err) {
        errorMsg.value = "No heroes on leaderboard found."
        return [];
    }
}

async function getFallenHeroes() {
    errorMsg.value = '';

    try {
        return await $fetch('/api/graveyard', {
            method: 'GET'
        })

    } catch (err) {
        errorMsg.value = "Could not find any graves."
        return [];
    }
}

onMounted(async () => {
    leaderboard.value = await getLeaderboard();
    fallenHeroes.value = await getFallenHeroes();
})

</script>

<style scoped>
.recordsWrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    gap: 0.5rem;
}

.recordsContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0;
    gap: 0.5rem;
}

.recordTable {
    width: 20rem;
    border-collapse: separate;
    border-spacing: 0 0.5rem;
}

.recordTable thead th {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--warm-black);
}

.textLeft {
    text-align: left;
}
</style>