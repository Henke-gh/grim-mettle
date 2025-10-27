<template>
    <HeroCard />
    <div class="arenaWrapper">
        <h1>The Arena</h1>
        <section class="combatSelect">
            <h2>The challengers of your demise</h2>
            <ul class="monsterList" v-if="monsters">
                <li class="listItem" v-for="monster in monsters" :key="monster.id">
                    <p>{{ monster.name }}</p>
                    <button @click="showDetailedInfo(monster)">[ View ]</button>
                </li>
            </ul>
            <p v-else>Loading monsters..</p>
        </section>
    </div>
    <Teleport to="body">
        <div v-if="showMonsterModal" class="monsterModalWrapper">
            <section class="monsterDetails">
                <h3>[ {{ selectedMonster.name }} ] - level {{ selectedMonster.level }}</h3>
                <button @click="closeDetailedInfo">Close</button>
            </section>
        </div>
    </Teleport>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
import { ref } from 'vue';

const showMonsterModal = ref(false);
const selectedMonster = ref('');
const { data: monsters, error } = await useAsyncData('monsters', () => $fetch('/api/monster/monsterCollection'));

if (error.value) {
    console.error('Error fetching monsters:', error.value);
}

onMounted(async () => {
    console.log(monsters.value)
})

function showDetailedInfo(monster) {
    showMonsterModal.value = true;
    selectedMonster.value = monster;
}

function closeDetailedInfo() {
    showMonsterModal.value = false;
}
</script>

<style scoped>
.arenaWrapper {
    margin-top: 6.5rem;
    padding: 0.5rem;
}

.monsterList {
    list-style: none;
}

.listItem {
    display: flex;
    flex-direction: row;
}

/* === Modal View === */
.monsterModalWrapper {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 60;
    padding: 1rem;
}

.monsterDetails {
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
</style>