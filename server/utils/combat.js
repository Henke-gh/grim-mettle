//combatlog entry helper, makes building a more structured combat log easier.
function addLogEntry(type, data) {
  return { type, data };
}

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
  const criticalHit = false;
  let attackHits;

  if (attackSuccessful) {
    attackHits = true;
  } else {
    attackHits = false;
  }

  const result = { damage, attackHits, criticalHit };
  return result;
}

//calculate rewards upon successful combat,
//base values are modified by level difference to prevent cheesing lower level monsters.
//Award more xp if monster is significantly higher level.
function giveRewards(monster, hero) {
  const gold = Math.floor(Math.random() * 11 + 10);
  const xp = monster.xpPayout;
  let finalGold;
  let finalXp;

  const levelDiff = hero.level - monster.level;

  if (levelDiff >= 5) {
    finalGold = Math.floor(gold * 0.1);
    finalXp = Math.floor(xp * 0.1);
  } else if (levelDiff >= 2) {
    finalGold = Math.floor(gold * 0.5);
    finalXp = Math.floor(xp * 0.5);
  } else if (levelDiff <= -5) {
    finalGold = gold;
    finalXp = Math.floor(xp * 1.5);
  } else {
    finalGold = gold;
    finalXp = xp;
  }

  return { gold: finalGold, xp: finalXp };
}

//Main Combat Loop
export function doCombat(hero, heroEquipment, retreatValue, monster) {
  const heroFatigue = setHeroFatigue(hero.speed);
  const heroRetreatsAt = retreatValue;
  const combatLog = [];
  let rewards = { gold: 0, xp: 0 };
  let heroHP = hero.hp_current;
  let monsterHP = monster.hp;
  let turnCounter = 1;

  //Push combat start to log
  combatLog.push(
    addLogEntry("combat_start", { hero: hero.hero_name, monster: monster.name })
  );

  while (heroHP > heroRetreatsAt && monsterHP > 0) {
    //Stores the actions/ events of each turn and gets pushed to the combatLog at the end of combat.
    const turn = {
      number: turnCounter,
      actions: [],
    };

    if (monster.fatigue < turnCounter) {
      const getReward = giveRewards(monster, hero);
      rewards.gold = getReward.gold;
      rewards.xp = getReward.xp;

      turn.actions.push(
        addLogEntry("fatigue", {
          fighter: monster.name,
          fighterType: "monster",
        })
      );
      turn.actions.push(
        addLogEntry("defeat", {
          defeated: monster.name,
          defeatedType: "monster",
          victor: hero.hero_name,
        })
      );
      combatLog.push(addLogEntry("turn", turn));
      combatLog.push(
        addLogEntry("combat_end", {
          result: "victory",
          turns: turnCounter,
          hero: hero.hero_name,
          monster: monster.name,
          rewards: { gold: rewards.gold, xp: rewards.xp },
        })
      );
      break;
    }
    if (heroFatigue < turnCounter) {
      turn.actions.push(
        addLogEntry("fatigue", {
          fighter: hero.hero_name,
          fighterType: "hero",
        })
      );
      turn.actions.push(
        addLogEntry("defeat", {
          defeated: hero.hero_name,
          defeatedType: "hero",
          victor: monster.name,
          slain: heroHP <= 0,
        })
      );
      combatLog.push(addLogEntry("turn", turn));
      combatLog.push(
        addLogEntry("combat_end", {
          result: heroHP <= 0 ? "death" : "retreat",
          turns: turnCounter,
          hero: hero.hero_name,
          monster: monster.name,
        })
      );
      break;
    }

    const heroGoesFirst = determineInitiative(
      hero.initiative,
      monster.initiative
    );

    turn.actions.push(
      addLogEntry("initiative", {
        fighter: heroGoesFirst ? hero.hero_name : monster.name,
        fighterType: heroGoesFirst ? hero.hero_name : monster.name,
      })
    );

    if (heroGoesFirst) {
      //Player hero won initiative and attacks first.
      const outcome = combatAction(hero, monster, heroEquipment.main_hand);

      turn.actions.push(
        addLogEntry("attack", {
          attacker: hero.hero_name,
          attackerType: "hero",
          defender: monster.name,
          defenderType: "monster",
          weapon: heroEquipment.main_hand.name,
          hit: outcome.attackHits,
          damage: outcome.damage,
          critical: outcome.criticalHit,
        })
      );
      if (outcome.attackHits) {
        monsterHP -= outcome.damage;
        if (monsterHP <= 0) {
          const getReward = giveRewards(monster, hero);
          rewards.gold = getReward.gold;
          rewards.xp = getReward.xp;

          turn.actions.push(
            addLogEntry("defeat", {
              defeated: monster.name,
              defeatedType: "monster",
              victor: hero.hero_name,
            })
          );

          combatLog.push(addLogEntry("turn", turn));
          combatLog.push(
            addLogEntry("combat_end", {
              result: "victory",
              turns: turnCounter,
              hero: hero.hero_name,
              monster: monster.name,
              rewards: { gold: rewards.gold, xp: rewards.xp },
            })
          );

          break;
        }
      }

      //If not dead, monster counter-attacks.
      const counterAttackOutcome = combatAction(monster, hero, monster.weapon);

      turn.actions.push(
        addLogEntry("attack", {
          attacker: monster.name,
          attackerType: "monster",
          defender: hero.hero_name,
          defenderType: "hero",
          weapon: monster.weapon.name,
          hit: counterAttackOutcome.attackHits,
          damage: counterAttackOutcome.damage,
          critical: counterAttackOutcome.criticalHit,
        })
      );
      if (counterAttackOutcome.attackHits) {
        heroHP -= counterAttackOutcome.damage;

        if (heroHP <= heroRetreatsAt) {
          turn.actions.push(
            addLogEntry("defeat", {
              defeated: hero.hero_name,
              defeatedType: "hero",
              victor: monster.name,
              slain: heroHP <= 0,
            })
          );

          combatLog.push(addLogEntry("turn", turn));
          combatLog.push(
            addLogEntry("combat_end", {
              result: heroHP <= 0 ? "death" : "retreat",
              turns: turnCounter,
              hero: hero.hero_name,
              monster: monster.name,
            })
          );
          break;
        }
      }
    } else {
      //Monster won the initiative and attacks first.
      const outcome = combatAction(monster, hero, monster.weapon);

      turn.actions.push(
        addLogEntry("attack", {
          attacker: monster.name,
          attackerType: "monster",
          defender: hero.hero_name,
          defenderType: "hero",
          weapon: monster.weapon.name,
          hit: outcome.attackHits,
          damage: outcome.damage,
          critical: outcome.criticalHit,
        })
      );
      if (outcome.attackHits) {
        heroHP -= outcome.damage;

        if (heroHP <= heroRetreatsAt) {
          turn.actions.push(
            addLogEntry("defeat", {
              defeated: hero.hero_name,
              defeatedType: "hero",
              victor: monster.name,
              slain: heroHP <= 0,
            })
          );

          combatLog.push(addLogEntry("turn", turn));
          combatLog.push(
            addLogEntry("combat_end", {
              result: heroHP <= 0 ? "death" : "retreat",
              turns: turnCounter,
              hero: hero.hero_name,
              monster: monster.name,
            })
          );
          break;
        }
      }
      //The hero counter-attacks, if not at retreat value or dead.
      const counterAttackOutcome = combatAction(
        hero,
        monster,
        heroEquipment.main_hand
      );

      turn.actions.push(
        addLogEntry("attack", {
          attacker: hero.hero_name,
          attackerType: "hero",
          defender: monster.name,
          defenderType: "monster",
          weapon: heroEquipment.main_hand.name,
          hit: counterAttackOutcome.attackHits,
          damage: counterAttackOutcome.damage,
          critical: counterAttackOutcome.criticalHit,
        })
      );

      if (counterAttackOutcome.attackHits) {
        monsterHP -= counterAttackOutcome.damage;
      }

      if (monsterHP <= 0) {
        const getReward = giveRewards(monster, hero);
        rewards.gold = getReward.gold;
        rewards.xp = getReward.xp;

        turn.actions.push(
          addLogEntry("defeat", {
            defeated: monster.name,
            defeatedType: "monster",
            victor: hero.hero_name,
          })
        );

        combatLog.push(addLogEntry("turn", turn));
        combatLog.push(
          addLogEntry("combat_end", {
            result: "victory",
            turns: turnCounter,
            hero: hero.hero_name,
            monster: monster.name,
            rewards: { gold: rewards.gold, xp: rewards.xp },
          })
        );
        break;
      }
    }
    combatLog.push(addLogEntry("turn", turn));
    turnCounter++;
  }

  const result = { combatLog, heroHP, turnCounter, rewards };
  return result;
}
