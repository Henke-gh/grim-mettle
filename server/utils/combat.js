//Calculates hit damage, also needs to take monster/hero strength rating.
//Max and min values are inclusive when randomised.
export function doDamage(weapon, strength) {
  const minDmg = Math.ceil(weapon.minDmg);
  const maxDmg = Math.floor(weapon.maxDmg);
  const dmgBonus = Math.ceil(strength / 10);
  const weaponDmg = Math.floor(Math.random() * (maxDmg - minDmg + 1) + minDmg);
  const damage = dmgBonus + weaponDmg;

  return damage;
}

//Determine initiative (each round)
export function determineInitiative(heroInit, monsterInit) {
  const heroInitiative = Math.floor(Math.random() * (heroInit - 0 + 1));
  const monsterInitiative = Math.floor(Math.random() * (monsterInit - 0 + 1));

  if (heroInitiative >= monsterInitiative) {
    return true;
  } else {
    return false;
  }
}

//Set hero fatigue value
export function setHeroFatigue(heroSpeed) {
  const fatigue = Math.floor(5 + heroSpeed * 0.4);

  return fatigue;
}
//Determine if attacker hits or if defender evades

//Determine if defender blocks

//Main Combat Loop
export function doCombat(hero, retreatValue, monster) {
  const heroFatigue = setHeroFatigue(hero.speed);
  const heroRetreatsAt = retreatValue;
  const heroHasInitiative = determineInitiative(
    hero.initiative,
    monster.initiative
  );
  const combatLog = [];
  let heroHP = hero.hp_current;
  let turnCounter = 1;

  while (heroHP > heroRetreatsAt && monster.hp_current > 0) {
    combatLog.push(("Round ", turnCounter));

    if (heroFatigue >= turnCounter) {
      turnCounter++;
    } else {
      combatLog.push("Hero has gassed out.");
      break;
    }
  }
  console.log(turnCounter);
  console.log(heroHP);
  return combatLog;
}
