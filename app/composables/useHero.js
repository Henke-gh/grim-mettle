import { heroAvatars } from "../../utils/avatars";
import { computeDerivedStatBonus } from "~~/utils/heroUtils";
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

  //calculate final stat values
  const derivedStats = computed(() => {
    if (!hero.value) return null;
    return computeDerivedStatBonus({
      speed: hero.value.speed,
      block: hero.value.block,
      evasion: hero.value.evasion,
      initiative: hero.value.initiative,
    });
  });

  //check if hero has enough xp to level up
  const canLevelUp = computed(() => {
    if (!hero.value) return false;
    return hero.value.xp >= hero.value.xp_next_lvl;
  });

  return {
    hero,
    heroAvatar,
    derivedStats,
    loading,
    error,
    fetchHero,
    canLevelUp,
  };
};
