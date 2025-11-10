<template>
    <header class="lvlUpHeader">
        <h1>- Level Up -</h1>
    </header>
    <div class="lvlUpWrapper">
        <section class="wrapper" v-if="hero">
            <p>Distribute new skill points:</p>
            <p>{{ levelUpHero.statPointsRemaining }} points remaining.</p>
            <form @submit.prevent="submitLevelUp">
                <h3>Main Attributes</h3>
                <div class="container">
                    <div class="group">
                        <div class="stat">
                            <label for="strength">Strength: {{ hero.strength }}</label>
                            <input id="strength" type="number" :value="levelUpHero.stats.strength" min="0"
                                class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('strength', Number(event.target.value))" />
                        </div>
                        <div class="stat">
                            <label for="speed">Speed: {{ hero.speed }}</label>
                            <input id="speed" type="number" :value="levelUpHero.stats.speed" min="0" class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('speed', Number(event.target.value))" />
                        </div>
                        <div class="stat">
                            <label for="vitality">Vitality: {{ hero.vitality }}</label>
                            <input id="vitality" type="number" :value="levelUpHero.stats.vitality" min="0"
                                class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('vitality', Number(event.target.value))" />
                        </div>
                    </div>
                </div>
                <h3>Skills</h3>
                <div class="container">
                    <div class="group">
                        <h4>[Weapon Skills]</h4>
                        <div class="stat">
                            <label for="swords">Swords: {{ hero.swords }}</label>
                            <input id="swords" type="number" :value="levelUpHero.stats.swords" min="0" class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('swords', Number(event.target.value))" />
                        </div>
                        <div class="stat">
                            <label for="axes">Axes: {{ hero.axes }}</label>
                            <input id="axes" type="number" :value="levelUpHero.stats.axes" min="0" class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('axes', Number(event.target.value))" />
                        </div>
                        <div class="stat">
                            <label for="hammers">Hammers: {{ hero.hammers }}</label>
                            <input id="hammers" type="number" :value="levelUpHero.stats.hammers" min="0"
                                class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('hammers', Number(event.target.value))" />
                        </div>
                        <div class="stat">
                            <label for="spears">Spears: {{ hero.spears }}</label>
                            <input id="spears" type="number" :value="levelUpHero.stats.spears" min="0" class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('spears', Number(event.target.value))" />
                        </div>
                        <div class="stat">
                            <label for="daggers">Daggers: {{ hero.daggers }}</label>
                            <input id="daggers" type="number" :value="levelUpHero.stats.daggers" min="0"
                                class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('daggers', Number(event.target.value))" />
                        </div>
                    </div>
                    <div class="group">
                        <h4>[Other Skills]</h4>
                        <div class="stat">
                            <label for="block">Block: {{ derivedStats.trueBlock }}</label>
                            <input id="block" type="number" :value="levelUpHero.stats.block" class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('block', Number(event.target.value))" />
                        </div>
                        <div class="stat">
                            <label for="evasion">Evasion: {{ derivedStats.trueEvasion }}</label>
                            <input id="evasion" type="number" :value="levelUpHero.stats.evasion" class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('evasion', Number(event.target.value))" />
                        </div>
                        <div class="stat">
                            <label for="initiative">Initiative: {{ derivedStats.trueInitiative }}</label>
                            <input id="initiative" type="number" :value="levelUpHero.stats.initiative" class="statInput"
                                v-on:input="event => levelUpHero.allocateStatPoints('initiative', Number(event.target.value))" />
                        </div>
                    </div>
                </div>
                <DefaultButton text="Confirm" type="submit" :disabled="levelUpHero.statPointsRemaining !== 0" />
            </form>
        </section>
    </div>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});

import { useLevelUpStore } from "../stores/heroLevelUp"
import { ref } from "vue";
const levelUpHero = useLevelUpStore();
const { hero, loading, error, fetchHero, canLevelUp, derivedStats } = useHero();
const errorMsg = ref('');
const successMsg = ref('');

onMounted(async () => {
    await fetchHero();
    if (!canLevelUp) {
        navigateTo('/hero');
    }
})

async function submitLevelUp() {
    errorMsg.value = '';
    successMsg.value = '';
    if (levelUpHero.statPointsRemaining !== 0) {
        errorMsg.value = "Spend all your skill points"
        //loading.value = false
    }
    try {
        const res = await $fetch('/api/hero/levelUp', {
            method: 'POST',
            body: levelUpHero.getLevelUpPayload(),
        })

        successMsg.value = res.message;
        levelUpHero.reset();
        navigateTo('/hero');
    } catch (err) {
        errorMsg.value = err?.data?.message || 'Something went wrong'
    }
}

</script>

<style scoped>
.lvlUpHeader {
    text-align: center;
    background-color: var(--yellow);
    padding: 0.5rem;
}

.lvlUpWrapper {
    display: flex;
    flex-direction: column;
}

.group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.stat {
    display: flex;
    flex-direction: row;
    gap: 0.4rem;
    align-items: center;
    justify-content: space-between;
    width: 8rem;
}

.statInput {
    width: 1.5rem;
    text-align: center;
    font-family: monospace;
}
</style>