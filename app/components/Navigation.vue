<template>
    <nav class="publicNav">
        <NuxtLink to="/" style="text-decoration: none; color: var(--warm-black);">News</NuxtLink>
        <NuxtLink to="/hall-of-records" style="text-decoration: none; color: var(--warm-black);">Hall of Records
        </NuxtLink>
        <NuxtLink to="/game-guide" style="text-decoration: none; color: var(--warm-black);">Game Guide</NuxtLink>
        <NuxtLink v-if="!user" to="/login" style="text-decoration: none; color: var(--warm-black);">Login
        </NuxtLink>
        <NuxtLink v-if="!user" to="/register" style="text-decoration: none; color: var(--warm-black);">Register
        </NuxtLink>
        <button v-if="user" @click="logoutUser">Log out</button>
    </nav>
</template>

<script setup>
const user = useSupabaseUser();
</script>

<style scoped></style>