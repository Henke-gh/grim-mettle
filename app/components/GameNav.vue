<template>
    <div class="linksMenu">
        <button class="burgerBtn" @click="toggleGameMenu">
            <img src="/menuIcon_twist.svg" />
        </button>
        <p>Menu</p>
    </div>
    <div class="gameNavModalWrapper" @click.self="closeGameMenu" role="presentation" v-if="showGameMenu">
        <nav class="gameNav" role="dialog" aria-modal="true" aria-label="Game Menu">
            <img src="/smallDivider.svg" alt="Two swords on a horizontal line" />
            <div class="links">
                <NuxtLink to="/" style="text-decoration: none; color: var(--bone-white);">Start</NuxtLink>
                <NuxtLink to="/hall-of-records" style="text-decoration: none; color: var(--bone-white);">Hall of
                    Records
                </NuxtLink>
                <NuxtLink to="/game-guide" style="text-decoration: none; color: var(--bone-white);">Game Guide
                </NuxtLink>
                <div class="links separation">
                    <button class="menuButton" @click="logoutUser" v-if="user">Log Out</button>
                    <NuxtLink to="/login" v-if="!user" style="text-decoration: none; color: var(--bone-white);">
                        Login
                    </NuxtLink>
                    <NuxtLink to="/register" v-if="!user" style="text-decoration: none; color: var(--bone-white);">
                        Register</NuxtLink>
                </div>
            </div>
        </nav>
    </div>
</template>

<script setup>
const user = useSupabaseUser();
const showGameMenu = ref(false);

function toggleGameMenu() {
    showGameMenu.value = true;
}

function closeGameMenu() {
    showGameMenu.value = false;
}

function onEscape(e) {
    if (e.key === 'Escape') {
        closeGameMenu();
    }
}

onMounted(() => window.addEventListener('keydown', onEscape));
onBeforeUnmount(() => window.removeEventListener('keydown', onEscape));
</script>

<style scoped>
.linksMenu {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.burgerBtn {
    border: none;
    background: none;
}

.gameNavModalWrapper {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    z-index: 61;
    padding: 1rem;
}

.gameNav {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    background-color: var(--brown);
    color: var(--bone-white);
    border-bottom-left-radius: 0.5rem;
}

.links {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
}

.separation {
    padding-top: 1rem;
    border-top: 1px solid var(--bone-white);
}

.menuButton {
    border: none;
    background-color: var(--brown);
    color: var(--bone-white);
    text-align: left;
    font-family: monospace;

}

/* Positions the acual menu at the edge of the <main> element on larger screens
    Dirty fix? 
*/
@media only screen and (min-width: 650px) {
    .gameNav {
        right: calc((100vw - 650px - 15px) / 2);
    }
}
</style>