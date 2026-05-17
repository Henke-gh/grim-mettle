export function monstersByBracket(monsters) {
  const levelBrackets = [
    { maxLvl: 4, lvlSpan: "1 - 4", rank: "Novice", monsters: [], key: "I" },
    { maxLvl: 8, lvlSpan: "5 - 8", rank: "Gladiator", monsters: [], key: "II" },
    {
      maxLvl: 16,
      lvlSpan: "9 - 16",
      rank: "Veteran",
      monsters: [],
      key: "III",
    },
    { maxLvl: 21, lvlSpan: "17 - 21", rank: "Master", monsters: [], key: "IV" },
    { maxLvl: 30, lvlSpan: "22 - 30", rank: "Legend", monsters: [], key: "V" },
  ];

  for (const monster of monsters) {
    const bracket = levelBrackets.find((b) => monster.level <= b.maxLvl);
    if (bracket) {
      bracket.monsters.push(monster);
    }
  }

  return levelBrackets;
}
