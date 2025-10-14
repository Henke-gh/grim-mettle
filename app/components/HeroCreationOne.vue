<template>
    <section class="heroCreation">
        <form>
            <h2>Create your Hero - step 1/2</h2>
            <div class="portraitSelection">
                <label for="heroAvatar">
                    <h3>Select avatar:</h3>
                </label>
                <div class="portrait" v-for="avatar in avatars" v-bind="avatar.id">
                    <input type="hidden" id="heroAvatar" v-model="avatar.id" />
                    <img :src="avatar.src" :alt="avatar.alt" class="portraitImg" />
                </div>
            </div>
            <div class="labelInput">
                <label for="heroName">
                    <h3>Name your champion:</h3>
                </label>
                <input type="text" id="heroName" min="3" max="16" placeholder="Give your hero a name"
                    v-model="heroName"></input>
            </div>
            <button class="continueBtn">Continue</button>
        </form>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { heroAvatars } from "../utils/avatars.js"

const avatars = heroAvatars;
const heroName = ref('')
</script>

<style lang="css" scoped>
.portraitSelection {
    display: flex;
    flex-direction: row;
}

.portraitImg {
    border-radius: 50%;
    width: 8rem;
    height: 8rem;
}

.labelInput {
    display: flex;
    flex-direction: column;
    width: fit-content;
}
</style>