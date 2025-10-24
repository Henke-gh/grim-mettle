import { itemCatalog } from "~~/utils/itemCatalog";

export const useItems = () => {
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

  return { getItemById };
};
