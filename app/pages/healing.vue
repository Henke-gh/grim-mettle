<template>
    <HeroCard />
    <div class="healingWrapper">
        <section>
            <h1>Forhild's Herbs and Splints</h1>
            <img class="hospitalImg" src="../assets/images/hospital_small.png"
                alt="A view of Forhild's medicinal hut." />
        </section>
    </div>
    <HeroNav />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
</script>

<style scoped>
.healingWrapper {
    margin-top: 6.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.hospitalImg {
    width: 20rem;
    height: auto;
}
</style>