<script setup>
import { ref } from "vue";
import guard from "../assets/images/arenaGuard.png";
import CustomHeader from "~/components/CustomHeader.vue";
import CustomFooter from "~/components/CustomFooter.vue";
import { latestNews, newsArchive } from "~/news";
const user = useSupabaseUser();
const showOldNews = ref(false);

function toggleNews() {
    showOldNews.value = true;
}
</script>

<template>
    <CustomHeader />
    <div class="indexWrapper">
        <section class="welcome">
            <div class="guardContainer">
                <img :src="guard" alt="A hooded guard watching the gates of an arena" class="guardImg" />
            </div>
            <div class="layout-news-login">
                <section class="news">
                    <p class="centerText"><span class="bold">News:</span> {{ latestNews.message }}
                        <span class="italic"> - {{ latestNews.date }}</span>
                    </p>
                    <button v-on:click="toggleNews" v-if="!showOldNews" class="newsButton">More News</button>
                    <div class="olderNews" v-if="showOldNews">
                        <p class="bold centerText">Older News</p>
                        <p v-for="post in newsArchive" :key="post.date" class="centerText">{{ post.message }}
                            <span class="italic"> - {{ post.date }}</span>
                        </p>
                        <button v-on:click="showOldNews = false" class="newsButton">Hide</button>
                    </div>
                </section>
                <section class="loginWrapper">
                    <div class="loginContainer">
                        <img class="loginImg" src="/axeSword.png" alt="Illustration of a sword and an axe" />
                        <div class="login-item" v-if="!user">
                            <p class="customP">Start Playing</p>
                            <DefaultButton text="Login" routeTo="/login" theme="default" class="" />
                            <NuxtLink to="/register" style="color: var(--warm-black);">
                                <p class="bold">Register new user</p>
                            </NuxtLink>
                        </div>
                        <div class="login-item" v-else>
                            <p class="customP">Test your Mettle!</p>
                            <DefaultButton text="To Game" routeTo="/hero" theme="default" class="" />
                        </div>
                    </div>
                </section>
            </div>
            <article class="introText">
                <h2 class="centerText">Grim Mettle</h2>
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
        <div class="ctaRegister" v-if="!user">
            <p>Don't have an account? It's free and only takes a moment to set up.</p>
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
    padding: 0rem 0.5rem;
}

.layout-news-login {
    display: flex;
    flex-direction: column;
}

.introText {
    padding: 0 0.5rem;
    margin-top: 1rem;
}

.introText p {
    margin: 0.7rem 0;
}

.news {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1rem 1rem 1rem;
}

.newsButton {
    width: fit-content;
    background: none;
    box-shadow: none;
    border: 2px solid var(--dark-green);
    border-radius: 5px;
    padding: 0.2rem 0.8rem;
    cursor: pointer;
    font-family: "Roboto Mono", monospace;
    font-weight: 600;
}

.loginWrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0.5rem 1rem;
    gap: 2rem;
    border: 2px dotted var(--dark-green);
    border-radius: 0.5rem;
}

.loginContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 480px;
}

.loginImg {
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    border: 4px double var(--dark-green);
    background-color: var(--brown);
}

.login-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    padding: 1rem;
    padding-right: 0;
    gap: 1rem;
    width: 100%;
}

.ctaRegister {
    background-color: var(--dark-green);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 1rem;
    margin: 1rem 0.5rem;
    color: var(--bone-white);
    border-radius: 0.5rem;
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
    font-size: 1.1rem;
}

.guardContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 0.5rem;
}

.guardImg {
    width: 95vw;
    max-width: 600px;
    height: auto;
    border-radius: 0.5rem;
    border: 4px double var(--dark-green);
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

.olderNews {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

@media screen and (min-width: 600px) {
    .layout-news-login {
        flex-direction: row;
        align-items: flex-start;
        padding: 0 1rem;
        border-top: 2px dotted var(--dark-green);
        margin-top: 1rem;
    }

    .news {
        text-align: left;
        max-width: 265px;
    }

    .loginWrapper {
        border: none;
        border-radius: 0;
        border-left: 2px dotted var(--dark-green);
        padding-right: 0;
    }
}
</style>