<script setup>
definePageMeta({
    middleware: ["auth",],
});

const supabase = useSupabaseClient();

const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigateTo("/");
    else console.error("Error signing out:", error.message);
};

function handleCreate() {
    navigateTo('/create-hero')
}
</script>

<template>
    <div>
        <button @click="handleCreate">Create new Hero</button>
        <button @click="handleSignOut">Sign Out</button>
    </div>
</template>
