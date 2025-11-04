<template>
    <nav class="publicNav">
        <div class="links">
            <NuxtLink to="/" style="text-decoration: none; color: var(--warm-black);">Start</NuxtLink>
            <p>-</p>
            <NuxtLink to="/hall-of-records" style="text-decoration: none; color: var(--warm-black);">Hall of Records
            </NuxtLink>
            <p>-</p>
            <NuxtLink to="/game-guide" style="text-decoration: none; color: var(--warm-black);">Game Guide</NuxtLink>
        </div>
        <div class="links" v-if="!user">
            <NuxtLink to="/login" style="text-decoration: none; color: var(--warm-black);">Login
            </NuxtLink>
            <p>-</p>
            <NuxtLink to="/register" style="text-decoration: none; color: var(--warm-black);">Register
            </NuxtLink>
        </div>
        <!--  <button v-if="user" @click="logoutUser">Log out</button> -->
    </nav>
</template>

<script setup>
const user = useSupabaseUser();
</script>

<style scoped>
.publicNav {
    display: flex;
    flex-direction: column;
    padding-top: 0.2rem;
    border-top: 1px solid var(--warm-black);
}

.links {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
}
</style>