export const useEquipment = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const equipment = ref(null);
  const equipLoading = ref(false);
  const equipError = ref(null);

  const fetchEquipment = async () => {
    equipLoading.value = true;
    equipError.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from("hero_equipment")
        .select(
          "hero_id, user_id, main_hand, off_hand, armour, trinket_1, trinket_2, trinket_3"
        )
        .eq("user_id", user.value.sub)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        equipError.value = "No equipment found.";
        return;
      }

      equipment.value = data;
      console.log("Equipment fetched:", equipment.value);
    } catch (err) {
      equipError.value = err.message;
    }
  };

  return { fetchEquipment, equipment, equipError, equipLoading };
};
