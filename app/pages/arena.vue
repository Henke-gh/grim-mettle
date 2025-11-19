<template>
    <HeroCard />
    <div class="arenaWrapper">
        <h1>The Arena</h1>
        <section class="monsterSelect" v-if="!showCombatSettings">
            <img src="../assets/images/goblin_fighter_sharp.png" class="goblinCombatant"
                alt="A goblin fighter ready for battle." />
            <h2>The challengers of your demise</h2>
            <div class="swordlineContainer spacing"><img :src="swordLine" alt="A line of four swords" /></div>
            <ul class="monsterList" v-if="monsters">
                <li class="listItem" v-for="monster in monsters" :key="monster.id">
                    <p>{{ monster.name }} - Level: {{ monster.level }}</p>
                    <button class="inspectViewBtn bold" @click="showDetailedInfo(monster)">View</button>
                </li>
            </ul>
            <p v-else>Loading monsters..</p>
            <div class="swordlineContainer spacing"><img src="/divider.svg"
                    alt="A line of four swords, with a shield in the middle" /></div>
        </section>
        <div class="settingsWrapper" v-if="showCombatSettings && hero">
            <div class="gradientBorder fitContent">
                <section class="combatSettings">
                    <h2>Make your preparations </h2>
                    <h3>{{ hero.hero_name }} vs {{ selectedMonster.name }}</h3>
                    <div class="optionSelect">
                        <label for="stance">- Select fighting stance -</label>
                        <select v-model="selectedStance" id="stance" class="arenaInput">
                            <option v-for="stance in stances" :value="stance" :key="stance">{{ capitalise(stance) }}
                            </option>
                        </select>
                    </div>
                    <div class="optionSelect">
                        <label for="hp-selector">Set HP retreat value:</label>
                        <select v-model.number="retreatPercent" id="hp-selector" class="arenaInput">
                            <option v-for="percent in retreatOptions" :value="percent" :key="percent">{{ percent }}% HP
                            </option>
                        </select>
                    </div>
                    <p v-if="errorMsg">{{ errorMsg }}</p>
                    <div class="fightButtonGroup">
                        <button class="inspectViewBtn biggerBtn bold closeBtn" @click="regretChallenge">Back</button>
                        <button class="inspectViewBtn biggerBtn bold" @click="initiateFight()">Fight</button>
                    </div>
                </section>
            </div>
            <article class="stanceTips">
                <h2 class="centerText">- Stances -</h2>
                <h3>Balanced</h3>
                <p>This is the default stance, no additional modifiers.</p>
                <h3>Offensive</h3>
                <p>The Offensive stance offers a boost to your weapon skill and initiative while also applying a penalty
                    to your ability to block and evade.</p>
                <h3>Defensive</h3>
                <p>This stance is the reverse of Offensive. Increased block and evasion at the cost of initiative and
                    your chance to hit.</p>
            </article>
            <div class="swordlineContainer spacing"><img src="/divider.svg"
                    alt="A line of four swords, with a shield in the middle" /></div>
        </div>
    </div>
    <Teleport to="body">
        <div v-if="showMonsterModal" class="monsterModalWrapper" @click.self="closeDetailedInfo">
            <div class="gradientBorder">
                <section class="monsterDetails">
                    <div class="swordlineContainer spacing"><img :src="swordLine" alt="A line of four swords" /></div>
                    <h3>[ {{ selectedMonster.name }} ] - level {{ selectedMonster.level }}</h3>
                    <p>Weapon: {{ selectedMonster.weapon.name }}</p>
                    <p v-if="selectedMonster.shield">Shield: {{ selectedMonster.shield.name }}</p>
                    <p>Armour: {{ selectedMonster.armour.name }}</p>
                    <p class="italic">{{ selectedMonster.description }}</p>
                    <div class="monsterModalControls">
                        <button class="inspectViewBtn biggerBtn bold closeBtn" @click="closeDetailedInfo">Close</button>
                        <button class="inspectViewBtn biggerBtn bold"
                            @click="challengeMonster(selectedMonster)">Challenge</button>
                    </div>
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
import { capitalise } from '~~/utils/general';
import swordLine from "../assets/images/swordLine.svg"

const showMonsterModal = ref(false);
const selectedMonster = ref('');
const showCombatSettings = ref(false);
const retreatPercent = ref(50);
const selectedStance = ref("balanced");
const combatResult = useCombatResult();
const { data: monsters, error } = await useAsyncData('monsters', () => $fetch('/api/monster/monsterCollection'));
const { hero, initialise } = useHeroView();
const errorMsg = ref('');

//Creates an array with the selectable retreat values.
const retreatOptions = Array.from({ length: 11 }, (_, hp) => 100 - hp * 10);
const stances = ["balanced", "offensive", "defensive"];

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

function regretChallenge() {
    selectedStance.value = "balanced";
    retreatPercent.value = 50;
    selectedMonster.value = '';
    showCombatSettings.value = false;
}

//Makes some provisional checks before routing to the combat api for final validation and execution of combat.
async function initiateFight() {
    const desiredRetreatValue = Math.ceil((retreatPercent.value / 100) * hero.value.hp_max);

    if (hero.value.hp_current < desiredRetreatValue) {
        errorMsg.value = "You don't have enough HP. Recover a bit or adjust your retreat value."

        if (hero.value.grit_current <= 0) {
            errorMsg.value = "Not enough grit. Your hero is too tired to fight."

            return;
        }
    } else {
        try {
            const payload = { monsterID: selectedMonster.value.id, stance: selectedStance.value, retreatValue: retreatPercent.value };
            const result = await $fetch('/api/combat/fightMonster', { method: 'POST', body: payload })
            if (result) {
                combatResult.combatLog.value = result;
                navigateTo('/combat');
            }
        } catch (err) {
            throw err;
        }
    }
}

function onKeydown(e) {
    if (e.key === 'Escape' && showMonsterModal.value) closeDetailedInfo()
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.arenaWrapper {
    margin-top: 7rem;
    padding: 0.5rem;
    padding-bottom: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.settingsWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.arenaInput {
    font-family: monospace;
    border: 1px solid var(--dark-green);
}

.stanceTips {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
}

.monsterSelect {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
}

.monsterList {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 20rem;
    list-style: none;
}

.listItem {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.combatSettings {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20rem;
    gap: 0.5rem;
    background-color: var(--bone-white);
}

.goblinCombatant {
    height: auto;
    width: 20rem;
}

.optionSelect {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.fightButtonGroup {
    display: flex;
    flex-direction: row;
    gap: 3rem;
    margin: 1rem 0;
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
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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

.monsterModalControls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

@media only screen and (min-width: 650px) {
    .arenaWrapper {
        margin-top: 1rem;
    }
}
</style>