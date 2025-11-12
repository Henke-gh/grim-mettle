<template>
    <header class="combatHeader">
        <h1>- Combat Log -</h1>
    </header>
    <div class="combatWrapper">
        <div class="swordsContainer">
            <img :src="swords" alt="Two crossed swords" class="swordsImg" />
        </div>
        <section class="logEntry" v-for="(entry, index) in log" :key="index">
            <h2 v-if="entry.type === 'combat_start'" class="centerText">{{ entry.data.hero }} vs {{ entry.data.monster
                }}</h2>
            <p v-if="entry.type === 'combat_start'" class="italic centerText">An audience of {{ audience }} attendees
                cheer you on!
            </p>
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
                                    {{ action.data.attacker }} delivers a measured blow to {{ action.data.defender }}
                                    with {{ action.data.weapon }}.
                                    {{ action.data.defender }} parries the attack with {{ action.data.shield }} avoiding
                                    the worst of it.
                                    {{ action.data.defender }} takes {{ action.data.damage }}
                                    damage!<span v-if="action.data.damageReduction > 0" class="italic">
                                        ({{ action.data.damageReduction }} dmg absorbed)
                                    </span>
                                </template>
                                <template v-else>
                                    {{ action.data.attacker }} charges towards {{ action.data.defender }} with {{
                                        action.data.weapon }}.
                                    {{ action.data.defender }} tries to block the hit with {{ action.data.shield }} but
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
                            {{ action.data.attacker }} lets out a growl and swings {{ action.data.weapon }} in a wide
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
                    <img :src="victory" alt="A golden trophy with small ribbons flying in the air" class="resultImg" />
                    <div class="resultText">
                        <p><span class="bold">{{ entry.data.hero }}</span> is
                            victorious!
                        </p>
                        <div v-if="entry.data.rewards">You earn <span class="bold">{{ entry.data.rewards.xp }} XP</span>
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
        <button class="defaultButton default" @click="exitCombatLog">Continue</button>
        <div class="swordlineContainer spacing topMargin"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
    </div>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
import swords from "../assets/images/crossedSwords.png"
import death from "../assets/images/player_death_small.png"
import victory from "../assets/images/victory_small.png"
import defeatImg from "../assets/images/defeat_small.png"
import { getAudience } from "~~/utils/general";


const combatResult = useCombatResult();
const log = combatResult.combatLog.value;
const audience = getAudience();

onMounted(() => {
    if (!log) {
        return navigateTo('/arena');
    }
})

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
}

.swordsImg {
    height: 5rem;
    width: auto;
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
</style>