//ID ranges:
//0 - 99 = weapons
//100 - 199 = shields
//200 - 299 = armours
//300 - 399 = trinkets
//400+ = default starting items

export const weapons = [
  {
    id: 0,
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
    id: 1,
    category: "swords",
    slot: "main_hand",
    twoHanded: false,
    name: "Long Sword",
    minDmg: 5,
    maxDmg: 10,
    skillReq: { swords: 40 },
    strengthReq: 25,
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
];

export const armour = [
  {
    id: 200,
    category: "armour",
    name: "Leather Tunic",
    damageReduction: 1,
    goldCost: 75,
    weight: 1,
    bonus: {},
    description: "This one's made from leather, it's a fantasy trope.",
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

//These id's are default values in the hero_equipment-table.
export const starterGear = [
  {
    id: 400,
    category: "default",
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
      "Looks like you're unarmed. Might want to look into improving that situation.",
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

export const itemCatalog = { weapons, shields, armour, trinkets, starterGear };
