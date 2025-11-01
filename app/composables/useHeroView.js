import { useHero } from "#imports";
import { useEquipment } from "#imports";
import { useInventory } from "#imports";
import { useItems } from "#imports";

export const useHeroView = () => {
  const { hero, fetchHero, loading, error, heroAvatar, derivedStats } =
    useHero();
  const { inventory, fetchInventory, error: inventoryError } = useInventory();
  const { equipment, fetchEquipment, equipError } = useEquipment();
  const { getItemById } = useItems();

  const actionSuccess = ref(false);
  const actionError = ref(null);
  const actionLoading = ref(null);

  //Initialise all data.
  const initialise = async () => {
    await Promise.all([fetchHero(), fetchEquipment(), fetchInventory()]);
  };

  const mainAttributes = computed(() => {
    if (!hero.value) return null;
    return {
      strength: hero.value.strength,
      speed: hero.value.speed,
      vitality: hero.value.vitality,
    };
  });

  const skills = computed(() => {
    if (!hero.value || !derivedStats.value) return null;
    const allSkills = {
      swords: hero.value.swords,
      axes: hero.value.axes,
      hammers: hero.value.hammers,
      spears: hero.value.spears,
      daggers: hero.value.daggers,
      block: derivedStats.value.trueBlock,
      evasion: derivedStats.value.trueEvasion,
      initiative: derivedStats.value.trueInitiative,
    };
    //Only returns skills with a value higher than 0, ie. skills the player has acually spent points on.
    return Object.fromEntries(
      Object.entries(allSkills).filter(([_, value]) => value > 0)
    );
  });

  //Matches IDs in inventory with their respective item entry in itemCatalog
  const inventoryWithItems = computed(() => {
    if (!inventory.value) return [];
    return inventory.value.map((inv) => ({
      ...inv,
      item: getItemById(inv.item_id),
    }));
  });

  //Matches IDs in hero_equipment table with their respective item entries
  const equippedItems = computed(() => {
    if (!equipment.value) return null;
    return {
      mainHand: equipment.value.main_hand
        ? getItemById(equipment.value.main_hand)
        : null,
      offHand: equipment.value.off_hand
        ? getItemById(equipment.value.off_hand)
        : null,
      armour: equipment.value.armour
        ? getItemById(equipment.value.armour)
        : null,
      trinkets: [
        equipment.value.trinket_1
          ? getItemById(equipment.value.trinket_1)
          : null,
        equipment.value.trinket_2
          ? getItemById(equipment.value.trinket_2)
          : null,
        equipment.value.trinket_3
          ? getItemById(equipment.value.trinket_3)
          : null,
      ].filter((trinket) => trinket !== null),
    };
  });
  //Simply checks to see if a hero has any items in their inventory.
  const hasInventory = computed(() => {
    return inventory.value && inventory.value.length > 0;
  });

  /* === Equip and Unequip === */
  // Check if item is currently equipped
  const isEquipped = (itemId) => {
    if (!equipment.value) return false;
    const slots = [
      "main_hand",
      "off_hand",
      "armour",
      "trinket_1",
      "trinket_2",
      "trinket_3",
    ];
    return slots.some((slot) => equipment.value[slot] === itemId);
  };

  //Check if hero has enough strength to equip selected item (applies to shields and weapons)
  const canEquip = (item) => {
    if (!hero.value || !item) return false;

    if (item.strengthReq && hero.value.strength < item.strengthReq) {
      return false;
    }
    return true;
  };

  const equipItem = async (item_id, item_slot) => {
    actionLoading.value = true;
    actionError.value = null;
    actionSuccess.value = null;

    try {
      const response = await $fetch("/api/items/equip", {
        method: "POST",
        body: { item_slot, item_id },
      });

      actionSuccess.value = response.message;

      await fetchEquipment();
    } catch (err) {
      actionError.value = err?.data?.message || "Failed to equipd item.";
    } finally {
      actionLoading.value = false;

      //set timeout of success message, 3 seconds
      if (actionSuccess.value) {
        setTimeout(() => {
          actionSuccess.value = null;
        }, 3000);
      }
    }
  };

  //Unequip an item
  const unequipItem = async (item_slot) => {
    actionLoading.value = true;
    actionError.value = null;
    actionSuccess.value = null;

    try {
      const response = await $fetch("/api/items/unequip", {
        method: "POST",
        body: { item_slot },
      });

      actionSuccess.value = response.message;

      await fetchEquipment();
    } catch (err) {
      actionError.value = err?.data?.message || "Failed to unequip item.";
    } finally {
      actionLoading.value = false;

      if (actionSuccess.value) {
        setTimeout(() => {
          actionSuccess.value = null;
        }, 3000);
      }
    }
  };

  return {
    hero,
    heroAvatar,
    loading,
    error,
    mainAttributes,
    skills,
    inventoryWithItems,
    equippedItems,
    hasInventory,
    initialise,
    inventoryError,
    equipError,
    actionError,
    actionLoading,
    actionSuccess,
    unequipItem,
    equipItem,
    isEquipped,
    canEquip,
    fetchHero,
  };
};
