<script setup>
import grimLogo from "../assets/images/logo.svg"
import swords from "../assets/images/crossedSwords.png"
import swordLine from "../assets/images/swordLine.svg"
import guard from "../assets/images/scout_sharp.png"
</script>

<template>
    <header>
        <img :src="grimLogo" alt="Grim Mettle" class="logo" />
        <p class="tagline">- Where heroes live forever -</p>
        <p class="tagline">Until they die.</p>
    </header>
    <section class="welcome">
        <h1>Welcome to Grim Mettle</h1>
        <article>
            <h2>Test your mettle, claim your fame!</h2>
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
        <p>[Register new user]</p>
    </div>
    <div class="guardContainer">
        <img :src="guard" alt="A hooded guard watching the gates of an arena" class="guardImg" />
    </div>
    <footer>
        <p>Henrik Andersen 2025 - Grim Mettle</p>
    </footer>
</template>

<style scoped>
header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--yellow);
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--purple);
}

footer {
    position: relative;
    bottom: 0;
    padding-top: 1rem;
    padding-bottom: 1rem;
    width: 100%;
    background-color: var(--dark-purple);
    color: var(--yellow);
    text-align: center;
}

.tagline {
    margin: 0;
    margin-top: 0.2rem;
    font-size: 0.9rem;
    font-weight: 600;
}

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
    background-color: var(--turqoise);
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
    padding: 0.3rem;
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