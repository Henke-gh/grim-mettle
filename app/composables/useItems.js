import { itemCatalog } from "~~/utils/itemCatalog";

export const useItems = () => {
  // First takes an items hero_inventory id (stored in hero_equipment table) and matches that id with the item_id of selected item.
  //It's been a bit of a nightmare. A huge part of handling multiple entries of the same item, for example two "Short Swords".
  const getItemByInventoryId = (inventoryId, inventory) => {
    const invEntry = inventory.find((inv) => inv.id === inventoryId);
    if (!invEntry) return null;
    return getItemById(invEntry.item_id);
  };

  const getItemById = (itemId) => {
    if (itemId >= 0 && itemId <= 99) {
      return itemCatalog.weapons.find((w) => w.id === itemId);
    }
    if (itemId >= 100 && itemId <= 199) {
      return itemCatalog.shields.find((s) => s.id === itemId);
    }
    if (itemId >= 200 && itemId <= 299) {
      return itemCatalog.armour.find((a) => a.id === itemId);
    }
    if (itemId >= 300 && itemId <= 399) {
      return itemCatalog.trinkets.find((t) => t.id === itemId);
    }
    if (itemId >= 400) {
      return itemCatalog.starterGear.find((g) => g.id === itemId);
    }
    return null;
  };

  return { getItemById, getItemByInventoryId };
};
