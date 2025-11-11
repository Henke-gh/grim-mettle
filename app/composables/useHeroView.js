import { useHero } from "#imports";
import { useEquipment } from "#imports";
import { useInventory } from "#imports";
import { useItems } from "#imports";
import { getItemBonuses } from "~~/utils/heroUtils";
import { computeDerivedStatBonus } from "~~/utils/heroUtils";

export const useHeroView = () => {
  const {
    hero,
    fetchHero,
    loading,
    error,
    heroAvatar,
    canLevelUp,
    totalFights,
    winRatio,
  } = useHero();
  const { inventory, fetchInventory, error: inventoryError } = useInventory();
  const { equipment, fetchEquipment, equipError } = useEquipment();
  const { getItemById, getItemByInventoryId } = useItems();

  const actionSuccess = ref(false);
  const actionError = ref(null);
  const actionLoading = ref(null);

  //Initialise all data.
  const initialise = async () => {
    await Promise.all([fetchHero(), fetchEquipment(), fetchInventory()]);
  };

  const mainAttributes = computed(() => {
    if (!hero.value) return null;
    //Add item bonuses to calculation
    const itemBonuses = equipmentBonuses.value;
    return {
      strength: hero.value.strength + (itemBonuses.strength || 0),
      speed: hero.value.speed + (itemBonuses.speed || 0),
      vitality: hero.value.vitality + (itemBonuses.vitality || 0),
    };
  });

  //Derived Stats now take item bonuses into account!
  const derivedStats = computed(() => {
    if (!hero.value) return null;

    const itemBonuses = equipmentBonuses.value;

    // Combine base + bonuses
    const finalStats = {
      speed: hero.value.speed + (itemBonuses.speed || 0),
      block: hero.value.block + (itemBonuses.block || 0),
      evasion: hero.value.evasion + (itemBonuses.evasion || 0),
      initiative: hero.value.initiative + (itemBonuses.initiative || 0),
    };

    return computeDerivedStatBonus(finalStats);
  });

  const skills = computed(() => {
    if (!hero.value || !derivedStats.value) return null;
    const itemBonuses = equipmentBonuses.value;

    const allSkills = {
      swords: hero.value.swords + (itemBonuses.swords || 0),
      axes: hero.value.axes + (itemBonuses.axes || 0),
      hammers: hero.value.hammers + (itemBonuses.hammers || 0),
      spears: hero.value.spears + (itemBonuses.spears || 0),
      daggers: hero.value.daggers + (itemBonuses.daggers || 0),
      //Block, evasion and initiative get their item bonuses applied by the derived stats
      block: derivedStats.value.trueBlock,
      evasion: derivedStats.value.trueEvasion,
      initiative: derivedStats.value.trueInitiative,
    };

    return Object.fromEntries(
      Object.entries(allSkills).filter(([_, value]) => value > 0)
    );
  });

  //Matches IDs in inventory with their respective item entry in itemCatalog
  const inventoryWithItems = computed(() => {
    if (!inventory.value) return [];
    return inventory.value.map((inv) => ({
      inventory_id: inv.id, // ← Include unique ID
      item_id: inv.item_id,
      item: getItemById(inv.item_id),
    }));
  });

  //Matches IDs in hero_equipment table with their respective item entries
  const equippedItems = computed(() => {
    if (!equipment.value || !inventory.value) return null;
    return {
      mainHand: equipment.value.main_hand
        ? getItemByInventoryId(equipment.value.main_hand, inventory.value)
        : null,
      offHand: equipment.value.off_hand
        ? getItemByInventoryId(equipment.value.off_hand, inventory.value)
        : null,
      armour: equipment.value.armour
        ? getItemByInventoryId(equipment.value.armour, inventory.value)
        : null,
      trinkets: [
        {
          slot: "trinket_1",
          item: equipment.value.trinket_1
            ? getItemByInventoryId(equipment.value.trinket_1, inventory.value)
            : null,
        },
        {
          slot: "trinket_2",
          item: equipment.value.trinket_2
            ? getItemByInventoryId(equipment.value.trinket_2, inventory.value)
            : null,
        },
        {
          slot: "trinket_3",
          item: equipment.value.trinket_3
            ? getItemByInventoryId(equipment.value.trinket_3, inventory.value)
            : null,
        },
      ].filter((trinket) => trinket.item !== null),
    };
  });
  //Get equipment bonuses
  const equipmentBonuses = computed(() => {
    if (!equippedItems.value) return {};

    const equipmentAsSet = {
      main_hand: equippedItems.value.mainHand,
      off_hand: equippedItems.value.offHand,
      armour: equippedItems.value.armour,
      trinket_1:
        equippedItems.value.trinkets.find((t) => t.slot === "trinket_1")
          ?.item || null,
      trinket_2:
        equippedItems.value.trinkets.find((t) => t.slot === "trinket_2")
          ?.item || null,
      trinket_3:
        equippedItems.value.trinkets.find((t) => t.slot === "trinket_3")
          ?.item || null,
    };
    return getItemBonuses(equipmentAsSet);
  });

  //Simply checks to see if a hero has any items in their inventory.
  const hasInventory = computed(() => {
    return inventory.value && inventory.value.length > 0;
  });

  /* === Equip and Unequip === */
  // Check if item is currently equipped
  const isEquipped = (inventory_id) => {
    if (!equipment.value) return false;
    const slots = [
      "main_hand",
      "off_hand",
      "armour",
      "trinket_1",
      "trinket_2",
      "trinket_3",
    ];
    return slots.some((slot) => equipment.value[slot] === inventory_id);
  };

  //Check if hero has enough strength to equip selected item (applies to shields and weapons)
  const canEquip = (item) => {
    if (!hero.value || !item) return false;

    if (item.strengthReq && hero.value.strength < item.strengthReq) {
      return false;
    }
    return true;
  };

  const equipItem = async (item_id, inventory_id, item_slot) => {
    actionLoading.value = true;
    actionError.value = null;
    actionSuccess.value = null;

    try {
      const response = await $fetch("/api/items/equip", {
        method: "POST",
        body: { item_slot, inventory_id, item_id },
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
    fetchInventory,
    fetchEquipment,
    canLevelUp,
    totalFights,
    winRatio,
  };
};
