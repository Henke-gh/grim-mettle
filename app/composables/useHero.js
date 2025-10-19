export const useHero = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const router = useRouter();

  const hero = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchHero = async () => {
    if (!user.value) {
      router.push("/");
      return;
    }
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("heroes")
        .select("*")
        .eq("user_id", user.value.sub)
        .single();
      if (fetchError) throw fetchError;

      if (!data) {
        router.push("/create-hero");
        return;
      }

      hero.value = data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  return {
    hero,
    loading,
    error,
    fetchHero,
  };
};
