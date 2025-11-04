<template>
    <div class="combatWrapper">
        <h1>- Combat Log -</h1>
        <section class="logEntry" v-for="(entry, index) in log" :key="index">
            <h2 v-if="entry.type === 'combat_start'">{{ entry.data.hero }} vs {{ entry.data.monster }}</h2>
            <div class="turnBlock" v-if="entry.type === 'turn'">
                <h3>Turn {{ entry.data.number }}</h3>
                <article class="turnAction" v-for="(action, idx) in entry.data.actions" :key="idx">
                    <!-- Turn Initiative -->
                    <p v-if="action.type === 'initiative'">{{ action.data.fighter }} gets the upper hand!</p>
                    <!-- Attack phase -->
                    <p v-else-if="action.type === 'attack'">
                        <template v-if="action.data.hit && action.data.damage > 0">
                            {{ action.data.attacker }} charges towards {{ action.data.defender }} with {{
                                action.data.weapon }}. {{ action.data.attacker }} strikes a clean blow dealing {{
                                action.data.damage }}<span v-if="action.data.dmgReduction > 0" class="italic"> ({{
                                action.data.dmgReduction
                            }})</span> damage!
                        </template>
                        <template v-else-if="action.data.hit && action.data.damage <= 0">
                            {{ action.data.attacker }} charges towards {{ action.data.defender }} with {{
                                action.data.weapon }}. {{ action.data.attacker }}'s hit was absored by the armour of {{
                                action.data.defender }}.
                        </template>
                        <template v-else>
                            {{ action.data.attacker }} lets out a growl and swings {{ action.data.weapon }} in a wide
                            arc! {{ action.data.defender }} deftly dodges the attack.
                        </template>
                    </p>
                    <!-- Combat Resolves -->
                    <p v-else-if="action.type === 'fatigue'">
                        {{ action.data.fighter }} collapses in the sand, too tired to keep fighting.
                    </p>
                    <p v-else-if="action.type === 'defeat'">
                        {{ action.data.defeated }} {{ action.data.slain ? 'is slain!' : 'is defeated.' }}
                    </p>
                </article>
            </div>
            <!-- Rewards, retreats or deaths -->
            <div v-else-if="entry.type === 'combat_end'">
                <p v-if="entry.data.result === 'victory'">{{ entry.data.hero }} is victorious!</p>
                <div v-if="entry.data.rewards">You earn {{ entry.data.rewards.xp }} XP and {{ entry.data.rewards.gold }}
                    gold from the
                    duke's coffers.</div>
                <p v-else-if="entry.data.result === 'death'">Your journey ends. The dead salute you and the living move
                    on.</p>
                <p v-else>You live to fight another day, tend to your wounds.</p>
            </div>
        </section>
        <button @click="exitCombatLog">Continue</button>
    </div>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
const combatResult = useCombatResult();
const log = combatResult.combatLog.value;

onMounted(() => {
    if (!log) {
        return navigateTo('/arena');
    }
})

function exitCombatLog() {
    navigateTo('/arena');
}
</script>

<style scoped>
.combatWrapper {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>