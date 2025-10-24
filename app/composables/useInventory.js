export const useInventory = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const inventory = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchInventory = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from("hero_inventory")
        .select("item_id, hero_id, quantity, item_type")
        .eq("user_id", user.value.sub);

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        error.value = "No items in inventory.";
        return;
      }

      inventory.value = data;
    } catch (err) {
      error.value = err.message;
    }
  };

  return { fetchInventory, inventory, error, loading };
};
