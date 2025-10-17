export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();

  // Wait briefly for Supabase to restore session after login
  for (let i = 0; i < 10; i++) {
    if (user.value) return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  // Still no user? Redirect to login
  return navigateTo("/");
});
