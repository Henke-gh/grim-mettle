<template>
    <div class="combatWrapper">
        <section>
            <h1>- Combat Log -</h1>
            <article class="combatLog"></article>
        </section>
        <button @click="exitCombatLog">Continue</button>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});

function exitCombatLog() {
    navigateTo('/arena');
}
</script>

<style scoped></style>