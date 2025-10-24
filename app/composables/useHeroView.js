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
  };
};
