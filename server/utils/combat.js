//Set hero fatigue value
function setHeroFatigue(heroSpeed) {
  const fatigue = Math.floor(5 + heroSpeed * 0.4);

  return fatigue;
}

//Determine initiative (each round)
function determineInitiative(heroInit, monsterInit) {
  const heroInitiative = Math.floor(Math.random() * (heroInit - 0 + 1));
  const monsterInitiative = Math.floor(Math.random() * (monsterInit - 0 + 1));
  if (heroInitiative >= monsterInitiative) {
    return true;
  } else {
    return false;
  }
}

//Calculates hit damage, also needs to take monster/hero strength rating.
//Max and min values are inclusive when randomised.
function doDamage(weapon, strength) {
  const minDmg = Math.ceil(weapon.minDmg);
  const maxDmg = Math.floor(weapon.maxDmg);
  const dmgBonus = Math.ceil(strength / 10);
  const weaponDmg = Math.floor(Math.random() * (maxDmg - minDmg + 1) + minDmg);
  const damage = dmgBonus + weaponDmg;

  return damage;
}

//Give combatants a small chance for critical attack or miss.
function isCritical() {
  const rollCritical = Math.random() * 101;

  if (rollCritical > 96) {
    return true;
  } else {
    return false;
  }
}

//Determine if attacker hits or if defender evades
function makeAttack(attacker, defender, weapon) {
  const attackSkill = weapon.category;
  let skillDiff = attacker[attackSkill] - defender.evasion;

  //Apply penalty if attacker does not meet the skill req on equipped weapon.
  if (weapon.skillReq && attacker[attackSkill] < weapon.skillReq) {
    const penalty = weapon.skillReq - attacker[attackSkill];
    skillDiff -= penalty * 3;
  }

  //Determine hit chance based on the skill diff between attackers weapon skill and defender evaion.
  let hitChance;
  if (skillDiff >= 20) hitChance = 95;
  else if (skillDiff >= 10) hitChance = 80;
  else if (skillDiff >= 5) hitChance = 70;
  else if (skillDiff >= 0) hitChance = 60;
  else if (skillDiff >= -5) hitChance = 50;
  else if (skillDiff >= -10) hitChance = 35;
  else if (skillDiff >= -20) hitChance = 20;
  else hitChance = 10;

  const rollHitTarget = Math.random() * 100;

  if (rollHitTarget <= hitChance) {
    return true;
  } else {
    return false;
  }
}
//Determine if defender blocks if a shield is present in the off hand.
function attemptBlock() {}

//One full turn consists of two combatActions, each participant (hero and monster) gets to act and respond to attack.
function combatAction(attacker, defender, weapon) {
  const damage = doDamage(weapon, attacker.strength);
  const attackSuccessful = makeAttack(attacker, defender, weapon);
  let attackHits;

  if (attackSuccessful) {
    attackHits = true;
  } else {
    attackHits = false;
  }

  const result = { damage, attackHits };
  return result;
}

//Main Combat Loop
export function doCombat(hero, heroEquipment, retreatValue, monster) {
  const heroFatigue = setHeroFatigue(hero.speed);
  const heroRetreatsAt = retreatValue;
  const combatLog = [];
  let heroHP = hero.hp_current;
  let monsterHP = monster.hp;
  let turnCounter = 1;

  while (heroHP > heroRetreatsAt && monsterHP > 0) {
    combatLog.push("Round " + turnCounter);

    if (monster.fatigue < turnCounter) {
      combatLog.push(
        monster.name + " collapses in the sand. Too tired to get up."
      );
      break;
    }
    if (heroFatigue < turnCounter) {
      combatLog.push(hero.hero_name + " has gassed out.");
      break;
    }

    if (determineInitiative(hero.initiative, monster.initiative)) {
      combatLog.push(hero.hero_name + " goes first.");
      const outcome = combatAction(hero, monster, heroEquipment.main_hand);
      if (outcome.attackHits) {
        combatLog.push(
          hero.hero_name +
            " charges with " +
            heroEquipment.main_hand.name +
            " and delivers a clean strike."
        );
        combatLog.push(
          monster.name + " takes " + outcome.damage + " points of damage!"
        );

        monsterHP -= outcome.damage;
        if (monsterHP <= 0) {
          combatLog.push(monster.name + " is defeated.");
          break;
        }
      } else {
        combatLog.push(
          hero.hero_name +
            " swings " +
            heroEquipment.main_hand.name +
            " in a wide arc.."
        );
        combatLog.push(monster.name + " evades the desperate attack.");
      }
    } else {
      combatLog.push(monster.name + " gets the upper hand.");
      const outcome = combatAction(monster, hero, monster.weapon);
      if (outcome.attackHits) {
        combatLog.push(
          monster.name +
            " comes barreling towards " +
            hero.hero_name +
            " with " +
            monster.weapon.name +
            "!"
        );
        combatLog.push(
          "With murder in their eyes " +
            monster.name +
            " inflicts " +
            outcome.damage +
            " points of damage."
        );

        heroHP -= outcome.damage;
        if (heroHP <= heroRetreatsAt) {
          combatLog.push(hero.hero_name + " is defeated.");
          if (heroHP <= 0) {
            combatLog.push(hero.hero_name + " is slain!");
          }
          break;
        }
      } else {
        combatLog.push(
          monster.name + " slashes furiously at the air. Or something.."
        );
      }
    }
    turnCounter++;
  }

  const result = { combatLog, heroHP, turnCounter };
  return result;
}
