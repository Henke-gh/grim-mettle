export function monstersByBracket(monsters) {
  const levelBrackets = [
    { maxLvl: 4, lvlSpan: "1 - 4", rank: "Novice", monsters: [] },
    { maxLvl: 8, lvlSpan: "5 - 8", rank: "Gladiator", monsters: [] },
    { maxLvl: 12, lvlSpan: "9 - 12", rank: "Veteran", monsters: [] },
  ];

  for (const monster of monsters) {
    const bracket = levelBrackets.find((b) => monster.level <= b.maxLvl);
    if (bracket) {
      bracket.monsters.push(monster);
    }
  }

  return levelBrackets;
}
