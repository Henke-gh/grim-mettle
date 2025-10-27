<template>
    <HeroCard />
    <div class="arenaWrapper">
        <h1>The Arena</h1>
        <section class="monsterSelect" v-if="!showCombatSettings">
            <h2>The challengers of your demise</h2>
            <ul class="monsterList" v-if="monsters">
                <li class="listItem" v-for="monster in monsters" :key="monster.id">
                    <p>{{ monster.name }}</p>
                    <button @click="showDetailedInfo(monster)">[ View ]</button>
                </li>
            </ul>
            <p v-else>Loading monsters..</p>
        </section>
        <section class="combatSettings" v-if="showCombatSettings && hero">
            <h2>Make your preparations </h2>
            <h3>{{ hero.hero_name }} vs {{ selectedMonster.name }}</h3>
        </section>
    </div>
    <Teleport to="body">
        <div v-if="showMonsterModal" class="monsterModalWrapper" @click.self="closeDetailedInfo">
            <div class="gradientBorder">
                <section class="monsterDetails">
                    <h3>[ {{ selectedMonster.name }} ] - level {{ selectedMonster.level }}</h3>
                    <p>Weapon: {{ selectedMonster.weapon.name }}</p>
                    <p class="italic">{{ selectedMonster.description }}</p>
                    <button @click="challengeMonster(selectedMonster)">Challenge</button>
                    <button @click="closeDetailedInfo">Close</button>
                </section>
            </div>
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
const showCombatSettings = ref(false);
const { data: monsters, error } = await useAsyncData('monsters', () => $fetch('/api/monster/monsterCollection'));
const { hero, initialise } = useHeroView();

if (error.value) {
    console.error('Error fetching monsters:', error.value);
}

onMounted(async () => {
    await initialise();
})

function showDetailedInfo(monster) {
    showMonsterModal.value = true;
    selectedMonster.value = monster;
}

function closeDetailedInfo() {
    showMonsterModal.value = false;
    selectedMonster.value = '';
}

function challengeMonster(passMonster) {
    showCombatSettings.value = true;
    closeDetailedInfo();
    selectedMonster.value = passMonster
}

function onKeydown(e) {
    if (e.key === 'Escape' && showMonsterModal.value) closeDetailedInfo()
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
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
    width: 20rem;
    max-height: 90vh;
    overflow: auto;
    border-radius: 5px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    outline: none;
    padding: 1rem;
}
</style>