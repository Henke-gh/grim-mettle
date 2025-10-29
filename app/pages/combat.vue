<template>
    <div class="combatWrapper">
        <section>
            <h1>- Combat Log -</h1>
            <h2>Hero vs Monster</h2>
            <article class="combatLog" v-if="log">
                <p v-for="entry in log">{{ entry }}</p>
            </article>
            <p v-else>No combat log to read.</p>
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