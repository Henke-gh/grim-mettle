<template>
    <div>
        Magic!
        <button v-on:click="handleSignOut">sign out</button>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth',
});
import { useSupabaseUser } from '#imports';
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        navigateTo('/')
    } else {
        console.error('Error signing out:', error.message) //Clean up error msg/handling
    }
}
console.log(user);
</script>

<style scoped></style>