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
        <p>Distribute your starting stat-points:</p>
        <p>{{ hero.statPointsRemaining }} points remaining.</p>
        <form @submit.prevent="submitHero">
            <h3>Main Attributes</h3>
            <div class="container">
                <div class="group">
                    <div class="stat">
                        <label for="strength">Strength: 5 +</label>
                        <input id="strength" type="number" :value="hero.stats.strength" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('strength', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="speed">Speed: 5 +</label>
                        <input id="speed" type="number" :value="hero.stats.speed" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('speed', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="vitality">Vitality: 5 +</label>
                        <input id="vitality" type="number" :value="hero.stats.vitality" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('vitality', Number(event.target.value))" />
                    </div>
                </div>
                <div class="group">
                    <img class="avatarPreview" v-if="hero.selectedAvatar" :src="hero.selectedAvatar.src"
                        :alt="hero.selectedAvatar.alt" />
                    <p>{{ hero.name }}</p>
                </div>
            </div>
            <h3>Skills</h3>
            <div class="container">
                <div class="group">
                    <h4>[Weapon Skills]</h4>
                    <div class="stat">
                        <label for="swords">Swords:</label>
                        <input id="swords" type="number" :value="hero.stats.swords" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('swords', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="axes">Axes:</label>
                        <input id="axes" type="number" :value="hero.stats.axes" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('axes', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="hammers">Hammers:</label>
                        <input id="hammers" type="number" :value="hero.stats.hammers" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('hammers', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="spears">Spears:</label>
                        <input id="spears" type="number" :value="hero.stats.spears" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('spears', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="daggers">Daggers:</label>
                        <input id="daggers" type="number" :value="hero.stats.daggers" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('daggers', Number(event.target.value))" />
                    </div>
                </div>
                <div class="group">
                    <h4>[Other Skills]</h4>
                    <div class="stat">
                        <label for="block">Block:</label>
                        <input id="block" type="number" :value="hero.stats.block" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('block', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="evasion">Evasion:</label>
                        <input id="evasion" type="number" :value="hero.stats.evasion" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('evasion', Number(event.target.value))" />
                    </div>
                    <div class="stat">
                        <label for="initiative">Initiative:</label>
                        <input id="initiative" type="number" :value="hero.stats.initiative" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('initiative', Number(event.target.value))" />
                    </div>
                </div>
            </div>
            <DefaultButton text="Create Hero" type="submit" :disabled="hero.statPointsRemaining !== 0" />
        </form>
    </section>
</template>

<style scoped>
.wrapper {
    padding: 1rem;
    background-color: var(--turqoise);
    justify-self: center;
    width: 90%;
}

.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.group {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
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
}

.avatarPreview {
    border-radius: 50%;
    height: 5rem;
    width: 5rem;
}
</style>