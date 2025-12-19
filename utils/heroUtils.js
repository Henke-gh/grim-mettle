//The computed values are used in combat and displayed on the hero stat sheet but not saved to the db.
export function computeDerivedStatBonus(baseStats) {
  const { speed, block, evasion, initiative } = baseStats;

  const trueBlock = Math.floor(block + speed * 0.25);
  const trueEvasion = Math.floor(evasion + speed * 0.25);
  const trueInitiative = Math.floor(initiative + speed * 0.25);

  return { trueBlock, trueEvasion, trueInitiative };
}

//Hero max hitpoints calculation
export function computeHeroHP(strength, vitality) {
  const maxHP = Math.floor(vitality * 1.25 + strength * 0.2);

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
//Used during hero creation, simply adds +5 to the main attribute values.
export function applyBaseAttributeScores(strength, speed, vitality) {
  const finalStrength = strength + 5;
  const finalSpeed = speed + 5;
  const finalVitality = vitality + 5;

  return { finalStrength, finalSpeed, finalVitality };
}

//Check all equipped items for item bonuses to apply
export function getItemBonuses(equippedItems) {
  const bonuses = {};
  const slots = [
    "main_hand",
    "off_hand",
    "armour",
    "trinket_1",
    "trinket_2",
    "trinket_3",
  ];
  //Go through each equipment slot
  slots.forEach((slot) => {
    const item = equippedItems[slot];
    //If item exists, and has a bonus, and safety check bonus is an object we add the bonus to our bonuses object!
    if (item && item.bonus && typeof item.bonus === "object") {
      Object.entries(item.bonus).forEach(([stat, value]) => {
        bonuses[stat] = (bonuses[stat] || 0) + value;
      });
    }
  });
  return bonuses;
}

export function setDefaultMonsterBracket(heroLevel) {
  let showBracket = undefined;

  if (heroLevel <= 4) {
    showBracket = "Novice";
  } else if (heroLevel <= 8) {
    showBracket = "Gladiator";
  } else {
    showBracket = "Veteran";
  }

  return showBracket;
}
