<template>
    <div class="profile-header">
        <h1 v-if="username">{{ username }}</h1>
        <GameNav />
    </div>
    <section class="profile-main">
        <p><span class="bold">Profile Created: </span>{{ userCreated }}</p>
        <div class="current-hero" v-if="hero">
            <h2>Your Hero</h2>
            <div class="hero-overview">
                <div v-if="heroAvatar">
                    <img :src="heroAvatar.src" :alt="heroAvatar.alt" class="heroPortrait" />
                </div>
                <div class="part-col">
                    <p><span class="bold">Name: </span>{{ hero.hero_name }}</p>
                    <p><span class="bold">Level: </span>{{ hero.level }}</p>
                    <p><span class="bold">Created: </span>{{ heroCreated }}</p>
                </div>
            </div>
            <div v-if="!toggleWarning" class="danger-zone">
                <p v-if="deletionFailure">{{ deletionFailure }}</p>
                <h3>Hero Deletion</h3>
                <p>Deleting a hero will allow you to create a new one. Heroes deleted this way will not appear on any
                    leaderboards.</p>
                <button @click="toggleWarning = true" class="delete-btn">Delete Hero</button>
                <p><span class="bold">WARNING!</span> There's no going back. Once a hero is deleted it is gone forever.
                </p>
            </div>
            <div v-if="toggleWarning" class="danger-zone">
                <h3>Do you wish to delete your hero?</h3>
                <p>Clicking Delete Hero will permanently delete your hero and send you to Hero Creation.</p>
                <div class="part-row">
                    <button @click="toggleWarning = false" class="delete-btn cancel-btn">Cancel</button>
                    <button v-on:click="processHeroDeletion" class="delete-btn">Delete Hero</button>
                </div>
                <p><span class="bold">WARNING!</span> There's no going back. Once a hero is deleted it is gone forever.
                </p>
            </div>
        </div>
    </section>
    <CustomFooter />
</template>

<script setup>
definePageMeta({
    middleware: ["auth",],
});
const { fetchUsername, username, fetchHero, hero, heroAvatar, heroCreated, userCreated } = useHero();
const toggleWarning = ref(false);
const deletionFailure = ref(null);

onMounted(async () => {
    await fetchUsername();
    await fetchHero();
});

async function processHeroDeletion() {
    try {
        const heroID = hero.value.id;
        const payload = { id: heroID };
        const result = await $fetch('/api/hero/deleteHero', { method: 'POST', body: payload })
        if (result) {
            toggleWarning.value = false;
            navigateTo('/create-hero');
        } else {
            toggleWarning.value = false;
            deletionFailure.value = "Could not process hero deletion.";
        }
    } catch (err) {
        throw err;
    }
}
</script>

<style lang="css" scoped>
.profile-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: var(--yellow);
    border-bottom: 5px double var(--bone-white);
}

.profile-main {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    padding-bottom: 5rem;
    gap: 0.5rem;
    height: 100vh;
}

.current-hero {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.hero-overview {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    border-radius: 5px;
    border: 5px double var(--dark-green);
    padding: 0.5rem;
}

.part-col {
    display: flex;
    flex-direction: column;
}

.part-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.danger-zone {
    margin-top: 4rem;
    border-radius: 5px;
    border: 5px double var(--red);
    padding: 0.5rem;
}

.delete-btn {
    border: none;
    border-radius: 5px;
    font-family: monospace;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.5rem 0.8rem 0.5rem;
    box-shadow: 2px 2px 5px var(--warm-black);
    cursor: pointer;
    background-color: var(--red);
    color: var(--bone-white);
    margin: 1rem 0rem;
}

.cancel-btn {
    background: var(--dark-green);
}
</style>