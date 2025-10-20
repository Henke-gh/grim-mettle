//ID ranges:
//0 - 99 = weapons
//100 - 199 = shields
//200 - 299 = armours
//300 - 399 = trinkets

export const weapons = [
  {
    id: 0,
    category: "default",
    name: "Fists",
    minDmg: 1,
    maxDmg: 2,
    skillReq: 0,
    weight: 0,
    goldCost: 0,
    bonus: {},
    description:
      "Looks like you're unarmed. Might want to look into that situation.",
  },
  {
    id: 1,
    category: "sword",
    name: "Short Sword",
    minDmg: 2,
    maxDmg: 4,
    skillReq: 10,
    weight: 2,
    goldCost: 50,
    bonus: {},
    description: "Keep it short and sweet.",
  },
  {
    id: 2,
    category: "sword",
    name: "Long Sword",
    minDmg: 5,
    maxDmg: 10,
    skillReq: 40,
    weight: 5,
    goldCost: 200,
    bonus: { swords: 5 },
    description: "A classic, quite sharp and well balanced.",
  },
  /*   { id: 3, category: "axe", name: "Hand Axe", minDmg: 2, maxDmg: 5 },
  { id: 4, category: "hammer", name: "War Hammer", minDmg: 8, maxDmg: 15 }, */
];

export const shields = [
  {
    id: 100,
    category: "shields",
    name: "Buckler",
    skillReq: 10,
    blockValue: 5,
    goldCost: 25,
    weight: 5,
    bonus: { block: 5 },
    description: "A metal disc.",
  },
];

export const armour = [
  {
    id: 200,
    category: "armour",
    name: "Plain Tunic",
    damageReduction: 0,
    goldCost: 0,
    weight: 0,
    bonus: {},
    description: "It's what you arrived in. It's got holes in it.",
  },
];

export const trinkets = [
  {
    id: 300,
    category: "trinkets",
    name: "Wrought-Iron Ring",
    goldCost: 150,
    bonus: {
      vitality: 5,
    },
    description:
      "Someone's carved runes into this. Fits around your arm like a bracelet.",
  },
];

export const itemCatalog = [weapons, shields, armour, trinkets];
