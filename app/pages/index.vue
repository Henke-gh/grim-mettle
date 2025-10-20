<script setup>
import swords from "../assets/images/crossedSwords.png"
import swordLine from "../assets/images/swordLine.svg"
import guard from "../assets/images/scout_sharp.png"
import CustomHeader from "~/components/CustomHeader.vue"
import CustomFooter from "~/components/CustomFooter.vue"
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
            <LoginForm />
        </div>
    </section>
    <div class="ctaRegister">
        <NuxtLink to="/register" style="text-decoration: none; color: var(--bone-white); cursor: pointer;">
            <p>[Register new user]</p>
        </NuxtLink>
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
    justify-content: space-between;
    background-color: var(--light-green);
}

.swordsContainer {
    background-color: var(--dark-green);
    border-radius: 50%;
    padding: 0.2rem;
    border: 3px dashed var(--yellow);
}

.swordsImg {
    height: 5rem;
    width: auto;
}

.ctaRegister {
    background-color: var(--dark-green);
    text-align: center;
    padding: 0.4rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--bone-white);
}

.ctaRegister p {
    margin: 0;
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
</style>