//ID ranges:
//0 - 99 = weapons
//100 - 199 = shields
//200 - 299 = armours
//300 - 399 = trinkets

export const weapons = [
  { id: 0, category: "default", name: "Fists", minDmg: 1, maxDmg: 2 },
  { id: 1, category: "sword", name: "Short Sword", minDmg: 2, maxDmg: 4 },
  { id: 2, category: "sword", name: "Long Sword", minDmg: 5, maxDmg: 10 },
  { id: 3, category: "axe", name: "Hand Axe", minDmg: 2, maxDmg: 5 },
  { id: 4, category: "hammer", name: "War Hammer", minDmg: 8, maxDmg: 15 },
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
