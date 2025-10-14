<script setup>
import { ref } from 'vue';

const strength = ref(5)
const speed = ref(5)
const vitality = ref(5)
const swords = ref(0)
const axes = ref(0)
const hammers = ref(0)
const spears = ref(0)
const daggers = ref(0)
const block = ref(0)
const evasion = ref(0)
const initiative = ref(0)
const statPoints = ref(75)

</script>

<template>
    <section class="wrapper">
        <h2>Build your Hero</h2>
        <p>Distribute your starting stat-points:</p>
        <p>{{ statPoints }} points remaining.</p>
        <form>
            <h3>Main Attributes</h3>
            <div class="container">
                <div class="group">
                    <div class="stat">
                        <label for="strength">Strength:</label>
                        <input id="strength" type="number" v-model="strength" min="5" class="statInput" />
                    </div>
                    <div class="stat">
                        <label for="speed">Speed:</label>
                        <input id="speed" type="number" v-model="speed" min="5" class="statInput" />
                    </div>
                    <div class="stat">
                        <label for="vitality">Vitality:</label>
                        <input id="vitality" type="number" v-model="vitality" min="5" class="statInput" />
                    </div>
                </div>
                <div class="group">
                    <img src="/avatars/avatarOne.png" class="avatarPreview" />
                    <p>Hero Name</p>
                </div>
            </div>
            <h3>Skills</h3>
            <div class="container">
                <div class="group">
                    <h4>[Weapon Skills]</h4>
                    <div class="stat">
                        <label for="swords">Swords:</label>
                        <input id="swords" type="number" v-model="swords" min="0" class="statInput" />
                    </div>
                    <div class="stat">
                        <label for="axes">Axes:</label>
                        <input id="axes" type="number" v-model="axes" min="0" class="statInput" />
                    </div>
                    <div class="stat">
                        <label for="hammers">Hammers:</label>
                        <input id="hammers" type="number" v-model="hammers" min="0" class="statInput" />
                    </div>
                    <div class="stat">
                        <label for="spears">Spears:</label>
                        <input id="spears" type="number" v-model="spears" min="0" class="statInput" />
                    </div>
                    <div class="stat">
                        <label for="daggers">Daggers:</label>
                        <input id="daggers" type="number" v-model="daggers" min="0" class="statInput" />
                    </div>
                </div>
                <div class="group">
                    <h4>[Other Skills]</h4>
                    <div class="stat">
                        <label for="block">Block:</label>
                        <input id="block" type="number" v-model="block" class="statInput" />
                    </div>
                    <div class="stat">
                        <label for="evasion">Evasion:</label>
                        <input id="evasion" type="number" v-model="evasion" class="statInput" />
                    </div>
                    <div class="stat">
                        <label for="initiative">Initiative:</label>
                        <input id="initiative" type="number" v-model="initiative" class="statInput" />
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
    gap: 0.5rem
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