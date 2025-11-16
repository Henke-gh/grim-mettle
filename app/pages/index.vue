<script setup>
import swords from "../assets/images/crossedSwords.png"
import guard from "../assets/images/scout_sharp.png"
import CustomHeader from "~/components/CustomHeader.vue"
import CustomFooter from "~/components/CustomFooter.vue"
const user = useSupabaseUser();

</script>

<template>
    <CustomHeader />
    <div class="indexWrapper">
        <section class="welcome">
            <div class="news">
                <p>* <span class="bold">Latest changes:</span> Block is now live. Try it out! *</p>
            </div>
            <div class="guardContainer">
                <img :src="guard" alt="A hooded guard watching the gates of an arena" class="guardImg" />
            </div>
            <article class="introText">
                <p>Grim Mettle lets you create a hero and battle foes in arena combat. Level up and spend skill points
                    to
                    improve your skills or learn new ones.</p>
                <p>On your journey you will equip your hero with all manner of items to further improve your character
                    and
                    prepare for
                    the dangers that lie ahead.</p>
            </article>
        </section>
        <div class="swordlineContainer spacing"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
        <div class="gradientBorder fitContent gradientLogin">
            <section class="loginWrapper">
                <div class="swordsContainer">
                    <img :src="swords" alt="Two crossed swords" class="swordsImg" />
                </div>
                <div class="loginContainer" v-if="!user">
                    <p class="customP">Start playing</p>
                    <DefaultButton text="Login" routeTo="/login" theme="default" class="" />
                </div>
                <div class="loginContainer" v-if="user">
                    <p class="customP">Test your Mettle!</p>
                    <DefaultButton text="To Game" routeTo="/hero" theme="default" class="" />
                </div>
            </section>
        </div>
        <div class="swordlineContainer spacing"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
        <div class="ctaRegister" v-if="!user">
            <p class="customP">Don't have an account? It only takes a moment to set up.</p>
            <DefaultButton text="Register new user" routeTo="/register" theme="light" type="button" />
        </div>
    </div>
    <CustomFooter />
</template>

<style scoped>
.indexWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.welcome {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.introText p {
    margin: 0.7rem 0;
}

.news {
    padding: 1rem;
}

.loginWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 18rem;
    padding: 0.4rem 2rem;
    gap: 2rem;
    background-color: var(--bone-white);
}

.loginContainer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
    width: 100%;
    background-color: var(--dark-green);
    padding: 2rem 0.4rem;
    margin-top: 1rem;
    font-weight: 600;
    color: var(--bone-white);
    gap: 1rem;
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