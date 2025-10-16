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

const supabase = useSupabaseClient();

const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        navigateTo('/')
    } else {
        console.error('Error signing out:', error.message) //Clean up error msg/handling
    }
}

</script>

<style scoped></style>