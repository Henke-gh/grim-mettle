<script setup>
import { useHeroCreateStore } from '../stores/heroCreate';
import { ref } from 'vue';

const hero = useHeroCreateStore();
const error = ref('');
const loading = ref(null);
const success = ref('');
const submitHero = async () => {
    loading.value = true
    error.value = ''
    success.value = ''
    if (hero.statPointsRemaining !== 0) {
        error.value = "Spend all your starting points"
        loading.value = false
    } else {
        try {
            const res = await $fetch('/api/hero/create', {
                method: 'POST',
                body: hero.getCreatePayload(),
            })
            success.value = res.message
            hero.reset();
            navigateTo('/hero');
        } catch (err) {
            error.value = err?.data?.message || 'Something went wrong'
        }

        loading.value = false
    }
}

</script>

<template>
    <section class="wrapper">
        <h2>Create your Hero - step 2/2</h2>
        <div class="group stepOneView">
            <img class="avatarPreview" v-if="hero.selectedAvatar" :src="hero.selectedAvatar.src"
                :alt="hero.selectedAvatar.alt" />
            <h3>{{ hero.name }}</h3>
        </div>
        <p>Distribute your starting stat-points:</p>
        <p>{{ hero.statPointsRemaining }} points remaining.</p>
        <div class="gradientBorder">
            <div class="tipsContainer">
                <p><span class="bold">Tip: </span>Your hero starts with a base of 5 in their attributes.</p>
                <p>All attributes and skills have their uses but early on some extra Vitality and good investment in one
                    of the weapon skills will be crucial.</p>
            </div>
        </div>
        <form @submit.prevent="submitHero" class="createHeroForm">
            <h3 class="createMargin">Main Attributes</h3>
            <div class="container">
                <div class="group">
                    <div class="stat">
                        <label for="strength">Strength: (5 +)</label>
                        <input id="strength" type="number" :value="hero.stats.strength === 0 ? '' : hero.stats.strength"
                            min="0" placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('strength', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="speed">Speed: (5 +)</label>
                        <input id="speed" type="number" :value="hero.stats.speed === 0 ? '' : hero.stats.speed" min="0"
                            placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('speed', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="vitality">Vitality: (5 +)</label>
                        <input id="vitality" type="number" :value="hero.stats.vitality === 0 ? '' : hero.stats.vitality"
                            min="0" placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('vitality', Number(event.target.value))" />
                    </div>
                </div>
            </div>
            <h3 class="createMargin">Skills</h3>
            <div class="container">
                <div class="group">
                    <h4 class="createMargin">[Weapon Skills]</h4>
                    <div class="stat">
                        <label for="swords">Swords:</label>
                        <input id="swords" type="number" :value="hero.stats.swords === 0 ? '' : hero.stats.swords"
                            min="0" placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('swords', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="axes">Axes:</label>
                        <input id="axes" type="number" :value="hero.stats.axes === 0 ? '' : hero.stats.axes" min="0"
                            placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('axes', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="hammers">Hammers:</label>
                        <input id="hammers" type="number" :value="hero.stats.hammers === 0 ? '' : hero.stats.hammers"
                            min="0" placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('hammers', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="spears">Spears:</label>
                        <input id="spears" type="number" :value="hero.stats.spears === 0 ? '' : hero.stats.spears"
                            min="0" placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('spears', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="daggers">Daggers:</label>
                        <input id="daggers" type="number" :value="hero.stats.daggers === 0 ? '' : hero.stats.daggers"
                            min="0" placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('daggers', Number(event.target.value))" />
                    </div>
                </div>
                <div class="group">
                    <h4 class="createMargin">[Other Skills]</h4>
                    <div class="stat">
                        <label for="block">Block:</label>
                        <input id="block" type="number" :value="hero.stats.block === 0 ? '' : hero.stats.block"
                            placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('block', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="evasion">Evasion:</label>
                        <input id="evasion" type="number" :value="hero.stats.evasion === 0 ? '' : hero.stats.evasion"
                            placeholder="0" class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('evasion', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="initiative">Initiative:</label>
                        <input id="initiative" type="number"
                            :value="hero.stats.initiative === 0 ? '' : hero.stats.initiative" placeholder="0"
                            class="statInput" inputmode="numeric"
                            v-on:input="event => hero.allocateStatPoints('initiative', Number(event.target.value))" />
                    </div>
                </div>
            </div>
            <p class="centerText">{{ hero.statPointsRemaining }} points remaining.</p>
            <div class="gradientBorder">
                <div class="tipsContainer">
                    <p><span class="bold">Almost done! </span>Once your hero is created your main priority is probably
                        to buy a weapon in the Market. This is a game about fightning monsters after all.</p>
                </div>
            </div>
            <div class="creationControls">
                <DefaultButton text="Back" type="button" theme="secondary" @click="hero.previousStep()" />
                <DefaultButton text="Create Hero" type="submit" :disabled="hero.statPointsRemaining !== 0" />
            </div>
            <p v-if="error">{{ error }}</p>
        </form>
        <div class="swordlineContainer spacing"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
    </section>
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.createHeroForm {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
}

.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 5rem;
}

.tipsContainer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: var(--bone-white);
    padding: 1rem;
}

.group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.stat {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: space-between;
}

.statInput {
    width: fit-content;
    max-width: 1.5rem;
    text-align: center;
    font-family: monospace;
    padding: 2px;
    border: 1px solid var(--dark-green);
}

.stepOneView {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.avatarPreview {
    border-radius: 50%;
    height: 6rem;
    width: auto;
    border: 5px double var(--dark-green);
}

.creationControls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.createMargin {
    margin: 0.5rem 0;
}
</style>