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

//Determine initiative (each round)
function determineInitiative(heroInit, monsterInit) {
  const heroInitiative = Math.floor(Math.random() * (heroInit - 0 + 1));
  const monsterInitiative = Math.floor(Math.random() * (monsterInit - 0 + 1));
  console.log("hero ini:", heroInitiative);
  console.log("monster ini:", monsterInitiative);
  if (heroInitiative >= monsterInitiative) {
    return true;
  } else {
    return false;
  }
}

//Set hero fatigue value
function setHeroFatigue(heroSpeed) {
  const fatigue = Math.floor(5 + heroSpeed * 0.4);

  return fatigue;
}
//Determine if attacker hits or if defender evades
function makeHeroAttack(hero, heroWeapon, monster) {
  //Determine which weapon skill to use by picking item category from currently equipped weapon.
  const weaponSkillName = heroWeapon.category;
  const heroWeaponSkillReq = heroWeapon.skillReq;
  const heroAttackSkill = hero.weaponSkillName;
  const monsterEvasion = monster.skills.evasion;
}

function makeMonsterAttack(monster, hero) {}
//Determine if defender blocks

//Main Combat Loop
export function doCombat(hero, heroEquipment, retreatValue, monster) {
  const heroFatigue = setHeroFatigue(hero.speed);
  const heroRetreatsAt = retreatValue;
  const combatLog = [];
  let heroHP = hero.hp_current;
  let turnCounter = 1;

  while (heroHP > heroRetreatsAt && monster.hp > 0) {
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

    if (determineInitiative(hero.initiative, monster.skills.initiative)) {
      const damage = doDamage(heroEquipment.main_hand, hero.strength);
      console.log("Hero Damage: ", damage);
      combatLog.push("Hero goes first.");
    } else {
      const damage = doDamage(monster.weapon, monster.strength);
      console.log("Monster Damage: ", damage);
      combatLog.push("Monster gets the upper hand.");
    }
    turnCounter++;
  }
  console.log(turnCounter);
  console.log(heroHP);
  return combatLog;
}
