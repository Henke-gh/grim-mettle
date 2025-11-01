export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();

  // If user is already present (client-side), allow access immediately
  if (user.value) return;

  // Try to restore session (important on refresh or SSR)
  const supabase = useSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && session.user) {
    // Session restored successfully
    user.value = session.user;
    return;
  }

  // No session, redirect to login page
  return navigateTo("/", { replace: true });
});
