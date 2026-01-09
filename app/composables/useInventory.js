export const useInventory = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const inventory = useState("inventory", () => []);
  const loading = useState("inventoryLoading", () => null);
  const error = useState("inventoryError", () => null);

  const fetchInventory = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from("hero_inventory")
        .select("id, item_id, hero_id, item_type")
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
