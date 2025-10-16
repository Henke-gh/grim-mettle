//The computed values are used in combat and displayed on the hero stat sheet but not saved to the db.
export function computeDerivedStatBonus(baseStats) {
  const { speed, block, evasion, initiative } = baseStats;

  const trueBlock = Math.round(block + speed * 0.25);
  const trueEvasion = Math.round(evasion + speed * 0.25);
  const trueInitiative = Math.round(initiative + speed * 0.25);

  return { trueBlock, trueEvasion, trueInitiative };
}

export function computeHeroHP(strength, vitality) {
  const maxHP = Math.round(vitality * 1.25 + strength * 0.2);

  return maxHP;
}

export function calculateAssignedStartingPoints(baseStats) {
  const totalPointsSpent =
    baseStats.strength +
    baseStats.speed +
    baseStats.vitality +
    baseStats.swords +
    baseStats.axes +
    baseStats.hammers +
    baseStats.spears +
    baseStats.daggers +
    baseStats.block +
    baseStats.evasion +
    baseStats.initiative;

  return totalPointsSpent;
}

export function applyBaseAttributeScores(strength, speed, vitality) {
  const finalStrength = strength + 5;
  const finalSpeed = speed + 5;
  const finalVitality = vitality + 5;

  return { finalStrength, finalSpeed, finalVitality };
}
