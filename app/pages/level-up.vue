<template>
    <header class="lvlUpHeader">
        <h1>- Level Up -</h1>
    </header>
    <div class="lvlUpWrapper">
        <h2>You've gained a Level!</h2>
        <div class="borderContainer">
            <div class="gradientBorder">
                <section class="wrapper" v-if="hero">
                    <h3>Distribute new skill points:</h3>
                    <p>{{ levelUpHero.statPointsRemaining }} points remaining.</p>
                    <form @submit.prevent="submitLevelUp" class="lvlUpForm">
                        <h3>Main Attributes</h3>
                        <div class="container">
                            <div class="group">
                                <div class="stat">
                                    <label for="strength">Strength: {{ mainAttributes.strength }}</label>
                                    <input id="strength" type="number"
                                        :value="levelUpHero.stats.strength === 0 ? '' : levelUpHero.stats.strength"
                                        min="0" class="statInput" placeholder="0" inputmode="numeric"
                                        v-on:input="event => levelUpHero.allocateStatPoints('strength', Number(event.target.value))" />
                                </div>
                                <div class="stat">
                                    <label for="speed">Speed: {{ mainAttributes.speed }}</label>
                                    <input id="speed" type="number"
                                        :value="levelUpHero.stats.speed === 0 ? '' : levelUpHero.stats.speed" min="0"
                                        class="statInput" placeholder="0" inputmode="numeric"
                                        v-on:input="event => levelUpHero.allocateStatPoints('speed', Number(event.target.value))" />
                                </div>
                                <div class="stat">
                                    <label for="vitality">Vitality: {{ mainAttributes.vitality }}</label>
                                    <input id="vitality" type="number"
                                        :value="levelUpHero.stats.vitality === 0 ? '' : levelUpHero.stats.vitality"
                                        min="0" class="statInput" placeholder="0" inputmode="numeric"
                                        v-on:input="event => levelUpHero.allocateStatPoints('vitality', Number(event.target.value))" />
                                </div>
                            </div>
                        </div>
                        <h3>Skills</h3>
                        <div class="container">
                            <section class="skills">
                                <div class="group">
                                    <h4>[Weapon Skills]</h4>
                                    <div class="stat">
                                        <label for="swords">Swords: {{ skills.swords || 0 }}</label>
                                        <input id="swords" type="number"
                                            :value="levelUpHero.stats.swords === 0 ? '' : levelUpHero.stats.swords"
                                            min="0" class="statInput" placeholder="0" inputmode="numeric"
                                            v-on:input="event => levelUpHero.allocateStatPoints('swords', Number(event.target.value))" />
                                    </div>
                                    <div class="stat">
                                        <label for="axes">Axes: {{ skills.axes || 0 }}</label>
                                        <input id="axes" type="number"
                                            :value="levelUpHero.stats.axes === 0 ? '' : levelUpHero.stats.axes" min="0"
                                            class="statInput" placeholder="0" inputmode="numeric"
                                            v-on:input="event => levelUpHero.allocateStatPoints('axes', Number(event.target.value))" />
                                    </div>
                                    <div class="stat">
                                        <label for="hammers">Hammers: {{ skills.hammers || 0 }}</label>
                                        <input id="hammers" type="number"
                                            :value="levelUpHero.stats.hammers === 0 ? '' : levelUpHero.stats.hammers"
                                            min="0" class="statInput" placeholder="0" inputmode="numeric"
                                            v-on:input="event => levelUpHero.allocateStatPoints('hammers', Number(event.target.value))" />
                                    </div>
                                    <div class="stat">
                                        <label for="spears">Spears: {{ skills.spears || 0 }}</label>
                                        <input id="spears" type="number"
                                            :value="levelUpHero.stats.spears === 0 ? '' : levelUpHero.stats.spears"
                                            min="0" class="statInput" placeholder="0" inputmode="numeric"
                                            v-on:input="event => levelUpHero.allocateStatPoints('spears', Number(event.target.value))" />
                                    </div>
                                    <div class="stat">
                                        <label for="daggers">Daggers: {{ skills.daggers || 0 }}</label>
                                        <input id="daggers" type="number"
                                            :value="levelUpHero.stats.daggers === 0 ? '' : levelUpHero.stats.daggers"
                                            min="0" class="statInput" placeholder="0" inputmode="numeric"
                                            v-on:input="event => levelUpHero.allocateStatPoints('daggers', Number(event.target.value))" />
                                    </div>
                                </div>
                                <div class="group">
                                    <h4>[Other Skills]</h4>
                                    <div class="stat">
                                        <label for="block">Block: {{ skills.block || 0 }}</label>
                                        <input id="block" type="number"
                                            :value="levelUpHero.stats.block === 0 ? '' : levelUpHero.stats.block"
                                            class="statInput" placeholder="0" inputmode="numeric"
                                            v-on:input="event => levelUpHero.allocateStatPoints('block', Number(event.target.value))" />
                                    </div>
                                    <div class="stat">
                                        <label for="evasion">Evasion: {{ skills.evasion || 0 }}</label>
                                        <input id="evasion" type="number"
                                            :value="levelUpHero.stats.evasion === 0 ? '' : levelUpHero.stats.evasion"
                                            class="statInput" placeholder="0" inputmode="numeric"
                                            v-on:input="event => levelUpHero.allocateStatPoints('evasion', Number(event.target.value))" />
                                    </div>
                                    <div class="stat">
                                        <label for="initiative">Initiative: {{ skills.initiative || 0 }}</label>
                                        <input id="initiative" type="number"
                                            :value="levelUpHero.stats.initiative === 0 ? '' : levelUpHero.stats.initiative"
                                            class="statInput" placeholder="0" inputmode="numeric"
                                            v-on:input="event => levelUpHero.allocateStatPoints('initiative', Number(event.target.value))" />
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div class="formControls">
                            <DefaultButton text="Confirm" type="submit"
                                :disabled="levelUpHero.statPointsRemaining !== 0" class="fitContent" />
                        </div>
                    </form>
                </section>
            </div>
        </div>
        <div class="swordlineContainer spacing"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
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
const { hero, loading, error, fetchHero, canLevelUp, mainAttributes, skills } = useHeroView();
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
    margin-bottom: 1rem;
    border-bottom: 5px double var(--bone-white);
}

.borderContainer {
    padding: 0.5rem;
}

.wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--bone-white);
    padding: 0.5rem;
}

.lvlUpForm {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.lvlUpWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding-bottom: 5rem;
}

.skills {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;
    padding: 0;
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

.formControls {
    display: flex;
    flex-direction: column;
    align-items: end;
    width: 100%;
    padding-bottom: 0.5rem;
}
</style>