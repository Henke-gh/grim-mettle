<template>
    <header class="combatHeader">
        <h1>- Combat -</h1>
    </header>
    <div class="combatWrapper">
        <!-- Versus animation -->
        <div class="versus-container" v-if="log && heroAvatar">
            <div class="contestant left">
                <img :src="heroAvatar.src" class="avatarImg hero-avatar" />
                <p class="hero-name custom-vs-txt">[ {{ log[0].data.hero }} ]</p>
            </div>
            <p class="versus-text custom-vs-txt italic">Versus..</p>
            <div class="contestant right">
                <img :src="monsterAvatar" class="avatarImg monster-avatar" />
                <p class="monster-name custom-vs-txt">[ {{ log[0].data.monster }} ]</p>
            </div>
        </div>
        <p v-if="log && heroAvatar" class="italic centerText audience-text">An audience of {{ audience }} attendees
            cheer you on!
        </p>
        <template v-if="showLogs">
            <section class="logEntry" v-for="(entry, index) in log" :key="index">
                <div class="turnBlock" v-if="entry.type === 'turn'">
                    <h3>[ Turn {{ entry.data.number }} ]</h3>
                    <article class="turnAction" v-for="(action, idx) in entry.data.actions" :key="idx">
                        <!-- Turn Initiative -->
                        <p v-if="action.type === 'initiative'" class="italic">{{ action.data.fighter
                            }} gets the upper hand!
                        </p>
                        <!-- Attack phase -->
                        <p v-else-if="action.type === 'attack'">
                            <template v-if="action.data.hit">
                                <!-- Attack hit with shield present -->
                                <template v-if="action.data.shield">
                                    <template v-if="action.data.blocked">
                                        {{ action.data.attacker }} delivers a measured blow to {{ action.data.defender
                                        }}
                                        with {{ action.data.weapon }}.
                                        {{ action.data.defender }} parries the attack with {{ action.data.shield }}
                                        avoiding
                                        the worst of it.
                                        {{ action.data.defender }} takes {{ action.data.damage }}
                                        damage!<span v-if="action.data.damageReduction > 0" class="italic">
                                            ({{ action.data.damageReduction }} dmg absorbed)
                                        </span>
                                    </template>
                                    <template v-else>
                                        {{ action.data.attacker }} charges towards {{ action.data.defender }} with {{
                                            action.data.weapon }}.
                                        {{ action.data.defender }} tries to block the hit with {{ action.data.shield }}
                                        but
                                        isn't quick enough.
                                        {{ action.data.attacker }} strikes a clean blow dealing {{ action.data.damage }}
                                        damage!<span v-if="action.data.damageReduction > 0" class="italic">
                                            ({{ action.data.damageReduction }} dmg absorbed)
                                        </span>
                                    </template>
                                </template>

                                <!-- Attack hit without shield -->
                                <template v-else>
                                    <template v-if="action.data.damage > 0">
                                        {{ action.data.attacker }} charges towards {{ action.data.defender }} with {{
                                            action.data.weapon }}.
                                        {{ action.data.attacker }} strikes a clean blow dealing {{ action.data.damage }}
                                        damage!<span v-if="action.data.damageReduction > 0" class="italic">
                                            ({{ action.data.damageReduction }} dmg absorbed)
                                        </span>
                                    </template>
                                    <template v-else>
                                        {{ action.data.attacker }} charges towards {{ action.data.defender }} with {{
                                            action.data.weapon }}.
                                        {{ action.data.attacker }}'s hit was absorbed by the armour of {{
                                            action.data.defender }}.
                                    </template>
                                </template>
                            </template>

                            <!-- Attack missed -->
                            <template v-else>
                                {{ action.data.attacker }} lets out a growl and swings {{ action.data.weapon }} in a
                                wide
                                arc!
                                {{ action.data.defender }} deftly dodges the attack.
                            </template>
                        </p>

                        <!-- Combat Resolves -->
                        <p v-else-if="action.type === 'fatigue'">
                            <span class="italic bold">{{ action.data.fighter }} collapses in the sand, too tired to keep
                                fighting.</span>
                        </p>
                        <p v-else-if="action.type === 'defeat'">
                            <span class="italic bold">
                                {{ action.data.defeated }} {{ action.data.slain ? 'is slain!' : 'is defeated.' }}
                            </span>
                        </p>
                    </article>
                </div>
                <!-- Rewards, retreats or deaths -->
                <div v-else-if="entry.type === 'combat_end'">
                    <div v-if="entry.data.result === 'victory'" class="resultCard">
                        <img :src="victory" alt="A golden trophy with small ribbons flying in the air"
                            class="resultImg" />
                        <div class="resultText">
                            <p><span class="bold">{{ entry.data.hero }}</span> is
                                victorious!
                            </p>
                            <div v-if="entry.data.rewards">You earn <span class="bold">{{ entry.data.rewards.xp }}
                                    XP</span>
                                and
                                <span class="bold">{{
                                    entry.data.rewards.gold }}
                                    gold</span> from the
                                duke's coffers.
                            </div>
                        </div>
                    </div>
                    <div v-else-if="entry.data.result === 'death'" class="resultCard">
                        <img :src="death" alt="Skulls and weapons piled around each other. Your hero has died."
                            class="resultImg" />
                        <div class="resultText">
                            <p class="bold">Your journey ends.</p>
                            <p>The dead salute you and the living move on.</p>
                        </div>
                    </div>
                    <div v-else class="resultCard">
                        <img :src="defeatImg" class="resultImg" alt="The hero leaves the arena in shame." />
                        <div class="resultText">
                            <p class="bold">Defeat.</p>
                            <p>You live to fight another day. Tend to your wounds.</p>
                        </div>
                    </div>
                </div>
            </section>
        </template>
        <button class="defaultButton default" @click="exitCombatLog" v-if="showLogs">Continue</button>
        <div class="swordlineContainer spacing topMargin"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
    </div>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
import gsap from "gsap";
import death from "../assets/images/player_death_small.png"
import victory from "../assets/images/victory_small.png"
import defeatImg from "../assets/images/defeat_small.png"
import monsterAvatar from "../assets/images/monster_Avatar.png"
import { getAudience, delay } from "~~/utils/general";

const { heroAvatar, fetchHero } = useHeroView();
const combatResult = useCombatResult();
const log = combatResult.combatLog.value;
const audience = getAudience();
const showLogs = ref(false);

onMounted(async () => {
    if (!log) {
        return navigateTo('/arena');
    }
    await fetchHero();
    combatIntroAnimation();
    await delay(3800);
    showLogs.value = true;

})

function combatIntroAnimation() {
    /* Combatants introduction */
    const tl_Combatants = gsap.timeline();
    // Set initial state
    gsap.set(".hero-avatar", { scaleY: 0, opacity: 0 });
    gsap.set(".monster-avatar", { scaleX: 0, opacity: 0 });

    tl_Combatants.to(".hero-avatar", { duration: 0.55, opacity: 1, scaleY: 1 })
    tl_Combatants.fromTo(".hero-name",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3, delay: 0.1, ease: "power1.in" });
    tl_Combatants.fromTo(".versus-text",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, delay: 0.3, ease: "power1.in" });
    tl_Combatants.to(".monster-avatar",
        { opacity: 1, duration: 0.45, delay: 0.3, scaleX: 1 });
    tl_Combatants.fromTo(".monster-name",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2, delay: 0.1, ease: "power1.in" });
    tl_Combatants.fromTo(".audience-text", { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, delay: 0.3, ease: "power1.in" })
}

function exitCombatLog() {
    //Check the log for the combat result, if the hero died during combat the player
    //should be sent to hero creation.
    const combatEnd = log.find(entry => entry.type === 'combat_end');

    combatResult.combatLog.value = null;

    if (combatEnd?.data.result === 'death') {
        navigateTo('/create-hero');
    } else {
        navigateTo('/arena');
    }
}
</script>

<style scoped>
.combatHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.5rem;
    background-color: var(--yellow);
    border-bottom: 5px double var(--bone-white);
}

.combatWrapper {
    padding: 0.5rem;
    padding-bottom: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

.resultCard {
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.resultImg {
    height: 6rem;
    width: auto;
}

.resultText {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.turnBlock {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.defaultButton {
    border: none;
    font-family: monospace;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.5rem 0.8rem 0.5rem;
    box-shadow: 3px 3px var(--warm-black);
    cursor: pointer;
}

.default {
    background-color: var(--dark-green);
    color: var(--bone-white);
}

/* Contestants portrait animation */
.versus-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    margin-bottom: 1rem;
    width: 100%;
}

.contestant {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    text-align: center;
    gap: 0.5rem;
    margin-left: 2rem;
}

.versus-text {
    margin-left: 10rem;
}

.avatarImg {
    height: 5rem;
    width: auto;
    border-radius: 50%;
    border: 4px double var(--dark-green);
    transform-origin: center;
}

.custom-vs-txt {
    font-weight: 600;
    font-family: 1.2rem;
}

@media only screen and (min-width: 650px) {
    .versus-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        width: 634px;
        height: 10rem;
    }

    .contestant {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.5rem;
        margin: 0;
    }

    .contestant.left {
        margin-left: 3rem;
    }

    .contestant.right {
        margin-right: 3rem;
    }

    .versus-text {
        margin-left: 0rem;
    }

    .avatarImg {
        height: 7rem;
        width: auto;
    }

    .custom-vs-txt {
        font-family: 1.2rem;
    }
}
</style>