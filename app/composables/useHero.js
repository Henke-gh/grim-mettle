import { heroAvatars } from "../../utils/avatars";
export const useHero = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const router = useRouter();

  const hero = useState("hero", () => null);
  const loading = useState("heroLoading", () => false);
  const error = useState("heroError", () => null);

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
        .maybeSingle();
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

  //get the hero avatar image
  const heroAvatar = computed(() => {
    if (!hero.value) return null;
    return heroAvatars.find((avatar) => avatar.id === hero.value.avatar);
  });

  //check if hero has enough xp to level up
  const canLevelUp = computed(() => {
    if (!hero.value) return false;
    return hero.value.xp >= hero.value.xp_next_lvl;
  });

  //Calculate total number of fights a hero has fought.
  const totalFights = computed(() => {
    const total = hero.value.wins + hero.value.losses;
    return total;
  });

  //Calculate win ratio as percentage wins
  const winRatio = computed(() => {
    if (totalFights.value <= 0) {
      return 0;
    }
    const ratio = Math.round((hero.value.wins / totalFights.value) * 100);
    return ratio;
  });

  return {
    hero,
    heroAvatar,
    loading,
    error,
    fetchHero,
    canLevelUp,
    totalFights,
    winRatio,
  };
};
