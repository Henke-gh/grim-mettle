export const logoutUser = async () => {
  const supabase = useSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (!error) navigateTo("/");
  else console.error("Error signing out:", error.message);
};
