//ID ranges:
//0 - 99 = weapons
//100 - 199 = shields
//200 - 299 = armours
//300 - 399 = trinkets
//400+ = default starting items

export const weapons = [
  {
    id: 1,
    category: "swords",
    slot: "main_hand",
    twoHanded: false,
    name: "Short Sword",
    minDmg: 2,
    maxDmg: 4,
    skillReq: { swords: 10 },
    strengthReq: 5,
    weight: 2,
    goldCost: 50,
    bonus: {},
    description: "Keep it short and sweet.",
  },
  {
    id: 2,
    category: "swords",
    slot: "main_hand",
    twoHanded: false,
    name: "Broad Sword",
    minDmg: 4,
    maxDmg: 8,
    skillReq: { swords: 40 },
    strengthReq: 25,
    weight: 5,
    goldCost: 200,
    bonus: { swords: 5 },
    description: "A thicker blade with a bit of heft.",
  },
  {
    id: 3,
    category: "axes",
    slot: "main_hand",
    twoHanded: false,
    name: "Hand Axe",
    minDmg: 2,
    maxDmg: 5,
    skillReq: { axes: 0 },
    strengthReq: 10,
    weight: 2,
    goldCost: 25,
    bonus: {},
    description: "A small, light-weight axe.",
  },
  {
    id: 4,
    category: "hammers",
    slot: "main_hand",
    twoHanded: false,
    name: "Club",
    minDmg: 1,
    maxDmg: 5,
    skillReq: { hammers: 0 },
    strengthReq: 5,
    weight: 1,
    goldCost: 20,
    bonus: {},
    description: "Includes membership in the Club Clubbers Club.",
  },
  {
    id: 5,
    category: "spears",
    slot: "main_hand",
    twoHanded: false,
    name: "Short Spear",
    minDmg: 2,
    maxDmg: 4,
    skillReq: { spears: 5 },
    strengthReq: 5,
    weight: 1,
    goldCost: 25,
    bonus: { initiative: 5 },
    description: "A stick with a pointy end. Decent reach.",
  },
  {
    id: 6,
    category: "daggers",
    slot: "main_hand",
    twoHanded: false,
    name: "Dagger",
    minDmg: 1,
    maxDmg: 4,
    skillReq: { daggers: 5 },
    strengthReq: 5,
    weight: 1,
    goldCost: 20,
    bonus: { evasion: 5 },
    description: "It ain't much, but it'll get the job done. If you're lucky.",
  },
];

export const shields = [
  {
    id: 100,
    category: "shields",
    slot: "off_hand",
    name: "Buckler",
    skillReq: { block: 10 },
    strengthReq: 5,
    blockValue: 5,
    goldCost: 25,
    weight: 0,
    bonus: { block: 5 },
    description: "A metal disc.",
  },
  {
    id: 101,
    category: "shields",
    slot: "off_hand",
    name: "Small Shield",
    skillReq: { block: 20 },
    strengthReq: 15,
    blockValue: 6,
    goldCost: 75,
    weight: 2,
    bonus: { block: 5 },
    description: "An iron-shod wooden square. It makes you feel safer.",
  },
];

export const armour = [
  {
    id: 200,
    category: "armour",
    slot: "armour",
    name: "Leather Tunic",
    damageReduction: 1,
    goldCost: 75,
    weight: 1,
    bonus: {},
    description: "This one's made from leather, it's a fantasy trope.",
  },
  {
    id: 201,
    category: "armour",
    slot: "armour",
    name: "Padded Tunic",
    damageReduction: 2,
    goldCost: 175,
    weight: 5,
    bonus: {},
    description: "The padding offers some extra protection.",
  },
];

export const trinkets = [
  {
    id: 300,
    category: "trinkets",
    slot: "trinket",
    name: "Wrought-Iron Ring",
    goldCost: 150,
    bonus: {
      vitality: 5,
    },
    description:
      "Someone's carved runes into this. Fits around your arm like a bracelet.",
  },
];

//These id's are default values in the hero_equipment-table.
export const starterGear = [
  {
    id: 400,
    category: "default",
    slot: "main_hand",
    twoHanded: false,
    name: "Unarmed",
    minDmg: 1,
    maxDmg: 2,
    skillReq: 0,
    weight: 0,
    goldCost: 0,
    bonus: {},
    description:
      "Your fists will only carry you so far. Might want to look into improving that situation.",
  },
  {
    id: 401,
    category: "armour",
    name: "Plain Tunic",
    damageReduction: 0,
    goldCost: 0,
    weight: 0,
    bonus: {},
    description: "It's what you arrived in. It's got holes in it.",
  },
];

export const getItemByInventoryId = (inventoryId, inventory) => {
  const invEntry = inventory.find((inv) => inv.id === inventoryId);
  if (!invEntry) return null;
  return getItemById(invEntry.item_id);
};

// Helper function to get item by ID
export const getItemById = (itemId) => {
  const id = Number(itemId);
  if (id >= 0 && id <= 99) {
    return weapons.find((w) => w.id === id);
  }
  if (id >= 100 && id <= 199) {
    return shields.find((s) => s.id === id);
  }
  if (id >= 200 && id <= 299) {
    return armour.find((a) => a.id === id);
  }
  if (id >= 300 && id <= 399) {
    return trinkets.find((t) => t.id === id);
  }
  if (id >= 400) {
    return starterGear.find((g) => g.id === id);
  }
  return null;
};

export const itemCatalog = { weapons, shields, armour, trinkets, starterGear };
