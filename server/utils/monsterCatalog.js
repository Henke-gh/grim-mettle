//Stores all monsters the player can fight.

export const monsterCatalog = [
  {
    id: 1,
    name: "Desert Rat",
    level: 1,
    xpPayout: 15,
    strength: 5,
    speed: 10,
    vitality: 10,
    skills: { attack: 30, evasion: 5, block: 0, initiative: 0 },
    fatigue: 15,
    hp: 20,
    weapon: { name: "Crooked Teeth", minDmg: 1, maxDMg: 4 },
    description: "This lil' guy carries all the diseases.",
  },
  {
    id: 2,
    name: "Goblin Mugger",
    level: 1,
    xpPayout: 20,
    strength: 15,
    speed: 10,
    vitality: 15,
    skills: { attack: 20, evasion: 0, block: 0, initiative: 0 },
    fatigue: 10,
    hp: 25,
    weapon: { name: "Rusty Dagger", minDmg: 1, maxDMg: 5 },
    description: "The little shits are everywhere.",
  },
  {
    id: 3,
    name: "Bandit",
    level: 2,
    xpPayout: 25,
    strength: 15,
    speed: 10,
    vitality: 15,
    skills: { attack: 20, evasion: 0, block: 0, initiative: 10 },
    fatigue: 10,
    hp: 35,
    weapon: { name: "Club", minDmg: 2, maxDMg: 6 },
    description: "A run of the mill lowlife.",
  },
];

export const viewMonsterCollection = monsterCatalog.map((monster) => ({
  id: monster.id,
  name: monster.name,
  level: monster.level,
  description: monster.description,
}));
