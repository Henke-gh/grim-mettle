<script setup>
definePageMeta({
    middleware: ["auth",],
});

const supabase = useSupabaseClient();


// Verify the user is authenticated
const {
    data: { user },
    error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
    console.error("Auth error:", userError);
    throw createError({ statusCode: 401, message: "Not authenticated" });
}

console.log("Authenticated user ID:", user.id);

const { data: existingHero, error: checkError } = await supabase
    .from("heroes")
    .select()
    .eq("user_id", user.id)
    .maybeSingle();

if (checkError) {
    console.error("Error checking existing hero:", checkError);
    throw createError({ statusCode: 500, message: checkError.message });
}

console.log("Existing hero check result:", existingHero ? "Found" : "None");
console.log(existingHero)

function handleCreate() {
    navigateTo('/create-hero')
}
</script>

<template>
    <div>
        <button @click="handleCreate">Create new Hero</button>
        <button @click="logoutUser">Sign Out</button>
    </div>
</template>
