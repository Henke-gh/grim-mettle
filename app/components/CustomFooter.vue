<template>
    <ClientOnly>
        <teleport to="#__nuxt">
            <footer>
                <p>Henrik Andersen 2025 - Grim Mettle</p>
            </footer>
        </teleport>
    </ClientOnly>
</template>

<script setup>

</script>

<style scoped>
footer {
    padding-top: 1rem;
    padding-bottom: 1rem;
    width: 100%;
    background-color: var(--dark-purple);
    color: var(--yellow);
    text-align: center;
    border-top: 4px double var(--bone-white);
}
</style>