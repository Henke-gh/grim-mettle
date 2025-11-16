<template>
    <div class="group">
        <header>
            <img :src="grimLogo" alt="Grim Mettle" class="logo" />
            <p class="tagline">- Where heroes live forever -</p>
            <p class="tagline">Until they die.</p>
        </header>
        <div class="navContainer">
            <GameNav />
        </div>
    </div>
</template>

<script setup>
import grimLogo from "../assets/images/Logo_variant.svg"
</script>

<style scoped>
.group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: var(--yellow);
    width: 100%;
    padding: 0.5rem;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 5px double var(--bone-white);
}

header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.logo {
    height: auto;
    width: 15rem;
}

.tagline {
    margin: 0;
    margin-top: 0.2rem;
    font-size: 1rem;
    font-weight: 600;
}

@media only screen and (min-width: 650px) {
    .group {
        padding-left: 0;
        justify-content: center;
        position: relative;
    }

    .navContainer {
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        display: flex;
        align-items: center;
    }
}
</style>