<template>
    <div class="group">
        <header>
            <img :src="grimLogo" alt="Grim Mettle" class="logo" />
            <p class="tagline">- Where heroes live forever -</p>
            <p class="tagline">Until they die.</p>
        </header>
    </div>
    <section class="confirmationWrapper">
        <h1>Your Account is Verified!</h1>
        <div class="swordlineContainer spacing"><img src="/divider.svg"
                alt="A line of four swords, with a shield in the middle" /></div>
        <article class="confirmBlurb">
            <p>Everything's set up and you're ready to start your adventure. Good luck!</p>
            <p>Close this page and go back to your previous tab or window to login and start playing.</p>
        </article>
    </section>
    <CustomFooter />
</template>

<script setup>
import grimLogo from "../assets/images/Logo_variant.svg"
</script>

<style scoped>
.group {
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: var(--yellow);
    padding: 0.5rem;
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
    width: 18rem;
}

.tagline {
    margin: 0;
    margin-top: 0.2rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.confirmationWrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
}

.confirmBlurb {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
}
</style>