<script setup>
import swords from "../assets/images/crossedSwords.png"
import swordLine from "../assets/images/swordLine.svg"
import guard from "../assets/images/scout_sharp.png"
import CustomHeader from "~/components/CustomHeader.vue"
import CustomFooter from "~/components/CustomFooter.vue"

function sendToLogin() {
    navigateTo('/login')
}
</script>

<template>
    <CustomHeader />
    <section class="welcome">
        <article>
            <div class="guardContainer">
                <img :src="guard" alt="A hooded guard watching the gates of an arena" class="guardImg" />
            </div>
            <p>Grim Mettle lets you create a hero and battle foes in arena combat. Level up and spend skill points to
                improve your skills or learn new ones.</p>
            <p>On your journey you will equip your hero with all manner of items to further improve your character and
                prepare for
                the dangers that lie ahead.</p>
        </article>
        <div class="swordlineContainer"><img :src="swordLine" alt="A line of four swords" /></div>
    </section>
    <section class="loginWrapper">
        <div class="swordsContainer">
            <img :src="swords" alt="Two crossed swords" class="swordsImg" />
        </div>
        <div class="loginContainer">
            <div class="gradientBorder fitContent">
                <button class="ctaLogin" v-on:click="sendToLogin">
                    <h1>Play now</h1>
                </button>
            </div>
            <p class="customP">Log in and start playing</p>
        </div>
    </section>
    <div class="swordlineContainer spacing"><img :src="swordLine" alt="A line of four swords" /></div>
    <div class="ctaRegister">
        <p class="customP">Don't have an account? It only takes a moment to set up.</p>
        <div class="gradientBorder fitContent">
            <NuxtLink to="/register" style="text-decoration: none; color: var(--bone-white); cursor: pointer;">
                <button class="ctaLogin registerBtn">[Register new user]</button>
            </NuxtLink>
        </div>
    </div>
    <CustomFooter />
</template>

<style scoped>
section {
    padding: 0.5rem;
}

.swordlineContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.loginWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
    background-color: var(--light-green);
}

.swordsContainer {
    background-color: var(--dark-green);
    border-radius: 50%;
    padding: 0.2rem;
    border: 3px dashed var(--yellow);
}

.swordsImg {
    height: 4.5rem;
    width: auto;
}

.ctaRegister {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: var(--dark-green);
    padding: 0.4rem;
    font-weight: 600;
    color: var(--bone-white);
    gap: 0.5rem;
}

.ctaLogin {
    border: none;
    font-family: monospace;
    font-weight: 600;
    color: var(--warm-black);
    background-color: var(--bone-white);
    border-radius: 5px;
    padding: 0.5rem 1rem 0.5rem 1rem;
}

.ctaLogin h1 {
    margin: 0;
}

.ctaRegister p {
    margin: 0;
}

.customP {
    font-weight: 400;
}

.guardContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 0.5rem;
}

.guardImg {
    width: 95vw;
    max-width: 500px;
    height: auto;
}

.fitContent {
    max-width: fit-content;
}

.registerBtn {
    font-size: 1rem;
}

.spacing {
    margin: 0.5rem;
}
</style>