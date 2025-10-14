<script setup>
import { useHeroCreateStore } from '../stores/heroCreate';

const hero = useHeroCreateStore();

</script>

<template>
    <section class="wrapper">
        <h2>Create your Hero - step 2/2</h2>
        <p>Distribute your starting stat-points:</p>
        <p>{{ hero.statPointsRemaining }} points remaining.</p>
        <form>
            <h3>Main Attributes</h3>
            <div class="container">
                <div class="group">
                    <div class="stat">
                        <label for="strength">Strength:</label>
                        <input id="strength" type="number" :value="hero.stats.strength" min="5" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('strength', event.target.value)" />
                    </div>
                    <div class="stat">
                        <label for="speed">Speed:</label>
                        <input id="speed" type="number" :value="hero.stats.speed" min="5" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('speed', event.target.value)" />
                    </div>
                    <div class="stat">
                        <label for="vitality">Vitality:</label>
                        <input id="vitality" type="number" :value="hero.stats.vitality" min="5" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('vitality', event.target.value)" />
                    </div>
                </div>
                <div class="group">
                    <img src="/avatars/avatarOne.png" class="avatarPreview" />
                    <p>{{ hero.heroName }}</p>
                </div>
            </div>
            <h3>Skills</h3>
            <div class="container">
                <div class="group">
                    <h4>[Weapon Skills]</h4>
                    <div class="stat">
                        <label for="swords">Swords:</label>
                        <input id="swords" type="number" :value="hero.stats.swords" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('swords', event.target.value)" />
                    </div>
                    <div class="stat">
                        <label for="axes">Axes:</label>
                        <input id="axes" type="number" :value="hero.stats.axes" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('axes', event.target.value)" />
                    </div>
                    <div class="stat">
                        <label for="hammers">Hammers:</label>
                        <input id="hammers" type="number" :value="hero.stats.hammers" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('hammers', event.target.value)" />
                    </div>
                    <div class="stat">
                        <label for="spears">Spears:</label>
                        <input id="spears" type="number" :value="hero.stats.spears" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('spears', event.target.value)" />
                    </div>
                    <div class="stat">
                        <label for="daggers">Daggers:</label>
                        <input id="daggers" type="number" :value="hero.stats.daggers" min="0" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('daggers', event.target.value)" />
                    </div>
                </div>
                <div class="group">
                    <h4>[Other Skills]</h4>
                    <div class="stat">
                        <label for="block">Block:</label>
                        <input id="block" type="number" :value="hero.stats.block" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('block', event.target.value)" />
                    </div>
                    <div class="stat">
                        <label for="evasion">Evasion:</label>
                        <input id="evasion" type="number" :value="hero.stats.evasion" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('evasion', event.target.value)" />
                    </div>
                    <div class="stat">
                        <label for="initiative">Initiative:</label>
                        <input id="initiative" type="number" :value="hero.stats.initiative" class="statInput"
                            v-on:input="event => hero.allocateStatPoints('initiative', event.target.value)" />
                    </div>
                </div>
            </div>
            <button class="submitBtn">Create Hero</button>
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