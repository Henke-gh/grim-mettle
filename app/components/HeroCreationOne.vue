<script setup>
import { heroAvatars } from "../../utils/avatars.js"
import { useHeroCreateStore } from "#imports";

const avatars = heroAvatars;
const hero = useHeroCreateStore();
</script>

<template>
    <section class="heroCreation">
        <h2>Create your Hero - step 1/2</h2>
        <div class="portraitSelection">
            <h3>Select avatar:</h3>
            <div class="portraitCollection">
                <div class="portrait" v-for="avatar in avatars" :key="avatar.id" v-on:click="hero.setAvatar(avatar.id)">
                    <img :src="avatar.src" :alt="avatar.alt" class="portraitImg"
                        :class="{ selected: hero.avatar === avatar.id }" />
                </div>
            </div>
        </div>
        <div class="labelInput">
            <label for="heroName">
                <h3>Name your champion:</h3>
            </label>
            <input class="nameInput" type="text" id="heroName" min="3" max="16" placeholder="Give your hero a name"
                :value="hero.name" v-on:input="event => hero.setHeroName(event.target.value)"></input>
        </div>
        <div class="nextStep">
            <DefaultButton text="Continue" type="button" :disabled="hero.name.length < 3" @click="hero.nextStep()" />
        </div>
    </section>
    <div class="swordlineContainer spacing"><img src="/divider.svg"
            alt="A line of four swords, with a shield in the middle" /></div>
</template>

<style lang="css" scoped>
.heroCreation {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}

.portraitSelection {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.portraitCollection {
    display: grid;
    grid-template-columns: 50% 50%;
    gap: 1rem;
    justify-items: center;
    align-items: center;
}

.portrait {
    height: fit-content;
    width: fit-content;
}

.portraitImg {
    border-radius: 50%;
    width: 8rem;
    height: 8rem;
    border: 4px dotted transparent;
    cursor: pointer;
}

.selected {
    border: 6px double var(--purple);
}

.labelInput {
    display: flex;
    flex-direction: column;
    width: fit-content;
    text-align: center;
    gap: 0.5rem;
}

.nextStep {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.nameInput {
    font-family: monospace;
    padding: 0.5rem;
    border: 1px solid var(--dark-green);
}
</style>