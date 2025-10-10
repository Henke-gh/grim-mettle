<template>
    <section class="heroCreation">
        <div class="portraitSelection">
<!--             <img src="/avatars/avatarOne.png" class="portraitImg" alt="Hero in red hood"/>
            <img src="/avatars/avatarTwo.png" class="portraitImg" alt="Hero with long brown hair"/>
            <img src="/avatars/avatarThree.png" class="portraitImg" alt="Hero with red hair"/>
            <img src="/avatars/avatarFour.png" class="portraitImg" alt="Bald hero with red beard"/> -->
        </div>
        <label for="heroName">Name your champion:</label>
        <input type="text" id="heroName"></input>
    </section>
</template>

<script setup>
import {heroAvatars} from "../utils/avatars.js"
const avatars = heroAvatars;
console.log(avatars)
</script>

<style lang="css" scoped>
.portraitSelection {
    display: grid;
}

.portraitImg{
    border-radius: 50%;
}

</style>