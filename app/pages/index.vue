<script setup>
import guard from "../assets/images/arenaGuard.png";
import CustomHeader from "~/components/CustomHeader.vue";
import CustomFooter from "~/components/CustomFooter.vue";
const user = useSupabaseUser();

</script>

<template>
    <CustomHeader />
    <div class="indexWrapper">
        <section class="welcome">
            <div class="news">
                <p class="centerText">* <span class="bold">News:</span> Critical hits are now possible. Both the player
                    and monsters might hit *significantly* harder than before.
                    <span class="italic">19/12-25</span> *
                </p>
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
        <section style="width: 100%;">
            <div class="swordlineContainer spacing"><img src="/divider.svg"
                    alt="A line of four swords, with a shield in the middle" /></div>
            <section class="loginWrapper">
                <div class="loginContainer" v-if="!user">
                    <p class="customP">Start playing</p>
                    <DefaultButton text="Login" routeTo="/login" theme="default" class="" />
                </div>
                <div class="loginContainer" v-if="user">
                    <p class="customP">Test your Mettle!</p>
                    <DefaultButton text="To Game" routeTo="/hero" theme="default" class="" />
                </div>
            </section>
            <div class="swordlineContainer spacing"><img src="/divider.svg"
                    alt="A line of four swords, with a shield in the middle" /></div>
            <div class="ctaRegister" v-if="!user">
                <p>Don't have an account? It's free and only takes a moment to set up.</p>
                <DefaultButton text="Register new user" routeTo="/register" theme="light" type="button" />
            </div>
        </section>
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
    padding: 0rem 1rem 1rem 1rem;
}

.loginWrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 1rem 2rem;
    margin: 1rem 0;
    gap: 2rem;
    background-color: var(--bone-white);
    border: 5px double var(--dark-green);
}

.loginContainer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.ctaRegister {
    background-color: var(--dark-green);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 1rem;
    padding-bottom: 1.5rem;
    margin: 1rem 0;
    color: var(--bone-white);
    border-radius: 5px;
    border: 5px double var(--bone-white);
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
    font-weight: 600;
    font-size: 0.9rem;
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