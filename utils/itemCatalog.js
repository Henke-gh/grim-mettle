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
    goldCost: 35,
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
  {
    id: 7,
    category: "axes",
    slot: "main_hand",
    twoHanded: false,
    name: "Small-Axe",
    minDmg: 3,
    maxDmg: 9,
    skillReq: { axes: 30 },
    strengthReq: 25,
    weight: 2,
    goldCost: 190,
    bonus: {},
    description:
      "Despite its name the Small-Axe is longer than the Hand Axe and can be quite deadly.",
  },
  {
    id: 8,
    category: "hammers",
    slot: "main_hand",
    twoHanded: false,
    name: "Iron Mace",
    minDmg: 2,
    maxDmg: 10,
    skillReq: { hammers: 25 },
    strengthReq: 40,
    weight: 2,
    goldCost: 185,
    bonus: {},
    description: "Who ever's on the receiving end better wear a helmet.",
  },
  {
    id: 9,
    category: "spears",
    slot: "main_hand",
    twoHanded: false,
    name: "Hunting Spear",
    minDmg: 2,
    maxDmg: 8,
    skillReq: { spears: 40 },
    strengthReq: 15,
    weight: 2,
    goldCost: 195,
    bonus: { initiative: 10 },
    description: "Sleek and well crafted, this spear gores boars.",
  },
  {
    id: 10,
    category: "daggers",
    slot: "main_hand",
    twoHanded: false,
    name: "Long Knife",
    minDmg: 3,
    maxDmg: 6,
    skillReq: { daggers: 35 },
    strengthReq: 10,
    weight: 1,
    goldCost: 190,
    bonus: { evasion: 10 },
    description:
      "The blade is quite long, and the edge sharp. Terrifying in a bar fight.",
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
    blockValue: 2,
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
    blockValue: 3,
    goldCost: 75,
    weight: 2,
    bonus: { block: 5 },
    description: "An iron-shod wooden square. It makes you feel safer.",
  },
  {
    id: 102,
    category: "shields",
    slot: "off_hand",
    name: "Round Shield",
    skillReq: { block: 35 },
    strengthReq: 25,
    blockValue: 3,
    goldCost: 130,
    weight: 2,
    bonus: { block: 15 },
    description: "In experience hands this light shield is a joy to wield.",
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
  {
    id: 202,
    category: "armour",
    slot: "armour",
    name: "Chain Mail",
    damageReduction: 3,
    goldCost: 225,
    weight: 5,
    bonus: { speed: -10 },
    description:
      "A classic, the added weight will tire you out quicker though.",
  },
];

export const trinkets = [
  {
    id: 300,
    category: "trinkets",
    slot: "trinket",
    name: "Wrought-Iron Ring",
    goldCost: 175,
    bonus: {
      speed: 5,
    },
    description:
      "Someone's carved runes into this. Fits around your arm like a bracelet.",
  },
  {
    id: 301,
    category: "trinkets",
    slot: "trinket",
    name: "Silver Leaf",
    goldCost: 190,
    bonus: {
      initiative: 5,
    },
    description:
      "Worn like a pin or a badge, it gleams an almost pure white in the sun.",
  },
  {
    id: 302,
    category: "trinkets",
    slot: "trinket",
    name: "Tooth-row Necklace",
    goldCost: 410,
    bonus: {
      strength: 10,
    },
    description: "Various animal teeth on a string. It's pretty savage.",
  },
];

//These id's are default values in the hero_equipment-table.
export const starterGear = [
  {
    id: 400,
    category: "strength",
    slot: "main_hand",
    twoHanded: false,
    name: "Fists",
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
