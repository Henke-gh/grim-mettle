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
                        <template v-if="action.data.hit">
                            {{ action.data.attacker }} charges towards {{ action.data.defender }} with {{
                                action.data.weapon }}. {{ action.data.attacker }} strikes a clean blow dealing {{
                                action.data.damage }} damage!
                        </template>
                        <template v-else>
                            {{ action.data.attacker }} lets out a growl and swings {{ action.data.weapon }} in a wide
                            arc! {{ action.data.defender }} deftly dodges the attack.
                        </template>
                    </p>
                    <!-- Combat Resolves -->
                    <p v-else-if="action.type === 'defeat'">
                        {{ action.data.defeated }} {{ action.data.slain ? 'is slain!' : 'is defeated.' }}
                    </p>
                </article>
            </div>
            <div v-else-if="entry.type === 'fatigue'" class="fatigue">
                <p>{{ entry.data.actor }} collapses from exhaustion!</p>
            </div>
            <div v-else-if="entry.type === 'combat_end'" class="combat-end">
                <p v-if="entry.data.result === 'victory'">Victory!</p>
                <p v-else-if="entry.data.result === 'death'">You have been defeated...</p>
                <p v-else>You retreat from combat!</p>
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
    console.log(log);
})

function exitCombatLog() {
    navigateTo('/arena');
}

//Processes the log entries.
function getLogText(entry) {
    switch (entry.type) {
        case "combat_start":
            return `${entry.data.hero} vs ${entry.data.monster}`;
        case "turn":
            return null; //Handled separately
        case "initiative":
            return `${entry.data.fighter} gets the upper hand and charges forward!`;

        case "attack":
            if (entry.data.hit) {
                if (entry.data.critical) {
                    return `Crits can't happen yet.`
                }
                return `${entry.data.attacker} strikes a fierce blow to ${entry.data.defender} with ${entry.data.weapon} dealing ${entry.data.damage} points of damage.`;
            } else {
                return `${entry.data.attacker} swings ${entry.data.weapon} in a wide arc, hitting all the air..` + `The attack is easily evaded by ${entry.data.defender}.`;
            }

        case "defeat":
            if (entry.data.slain) {
                return `${entry.data.defeated} is slain! The last feast is for the crows..`;
            }
            return `${entry.data.defeated} is defeated.`;

        case "fatigue":
            return `${entry.data.fighter} collapses in the sand. Too tired to keep fighting.`;

        case "combat_end":
            if (entry.data.result === "victory") {
                return `Victory!`;
            } else if (entry.data.result === "death") {
                return `Your grim mettle takes you no further.`
            } else {
                return `Tend to your wounds, you live to fight another day.`
            }
        default:
            return null;
    }
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