<template>
    <section class="heroCreation">
        <h2>Select your avatar</h2>
        <div class="portraitSelection">
            <div class="portrait" v-for="avatar in avatars" v-bind="avatar.id">
                <img :src="avatar.src" :alt="avatar.alt" class="portraitImg"/>
            </div>
        </div>
        <div class="labelInput">
        <label for="heroName">Name your champion:</label>
        <input type="text" id="heroName"></input>
        </div>
    </section>
</template>

<script setup>
import {heroAvatars} from "../utils/avatars.js"

const avatars = heroAvatars;
</script>

<style lang="css" scoped>
.portraitSelection {
    display: flex;
    flex-direction: row;
}

.portraitImg{
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