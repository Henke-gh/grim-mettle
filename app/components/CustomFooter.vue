<template>
    <ClientOnly>
        <teleport to="#__nuxt">
            <footer>
                <p>Henrik Andersen 2026 - Grim Mettle</p>
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
    background-color: var(--brown);
    color: var(--bone-white);
    text-align: center;
    border-top: 4px double var(--bone-white);
}
</style>