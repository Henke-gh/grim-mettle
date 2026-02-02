//combatlog entry helper, makes building a more structured combat log easier.
export function addLogEntry(type, data) {
  return { type, data };
}

//Set hero fatigue value
export function setHeroFatigue(heroSpeed) {
  const fatigue = Math.floor(5 + heroSpeed * 0.4);

  return fatigue;
}

//Determine initiative (each round)
function determineInitiative(heroInit, monsterInit) {
  const heroBaseIni = Math.floor(heroInit / 2);
  const monsterBaseIni = Math.floor(monsterInit / 2);
  const heroInitiative =
    heroBaseIni + Math.floor(Math.random() * (heroBaseIni - 0 + 1));
  const monsterInitiative =
    monsterBaseIni + Math.floor(Math.random() * (monsterBaseIni - 0 + 1));
  if (heroInitiative >= monsterInitiative) {
    return true;
  } else {
    return false;
  }
}

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

//Apply damage reduction from armour, return modified damage value
export function applyDamageReduction(damage, dmgRed) {
  let finalDamage = damage - dmgRed;
  if (finalDamage < 0) {
    finalDamage = 0;
  }

  return finalDamage;
}

//Give combatants a small chance for critical attack.
export function isCritical() {
  const rollCritical = Math.random() * 101;

  if (rollCritical > 95) {
    return true;
  } else {
    return false;
  }
}

export function isWeaponTwoHanded(weapon) {
  if (weapon.twoHanded) {
    return true;
  } else {
    return false;
  }
}

//Determine if attacker hits or if defender evades
export function makeAttack(attacker, defender, weapon) {
  const attackSkill = weapon.category;
  let skillDiff = attacker[attackSkill] - defender.evasion;

  //Apply penalty if attacker does not meet the skill req on equipped weapon.
  if (weapon.skillReq && attacker[attackSkill] < weapon.skillReq) {
    const penalty = weapon.skillReq - attacker[attackSkill];
    skillDiff -= penalty * 3;
  }

  //Determine hit chance based on the skill diff between attackers weapon skill and defender evaion.
  let hitChance;
  if (skillDiff >= 40) hitChance = 95;
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
//Has to handle hero off-hand empty/ null!
export function attemptBlock(
  attacker,
  defender,
  defenderShield,
  attackerWeapon,
  defenderWeapon,
) {
  //No shield, no 2-handed weapon. Defender can't block.
  if (!defenderShield && !isWeaponTwoHanded(defenderWeapon)) {
    return false;
  }

  const attackSkill = attackerWeapon.category;
  const defenderAttackSkill = defenderWeapon.category;

  //Defender has a two-handed weapon, can attempt block using their weapon skill to help determine successful block.
  if (!defenderShield && isWeaponTwoHanded(defenderWeapon)) {
    let skillDiff =
      Math.floor(defender.block + defender[defenderAttackSkill] / 2) -
      Math.floor(attacker[attackSkill] / 2);

    let blockChance;
    if (skillDiff >= 40) blockChance = 95;
    else if (skillDiff >= 20) blockChance = 80;
    else if (skillDiff >= 10) blockChance = 70;
    else if (skillDiff >= 0) blockChance = 60;
    else if (skillDiff >= -10) blockChance = 50;
    else if (skillDiff >= -20) blockChance = 35;
    else if (skillDiff >= -30) blockChance = 20;
    else blockChance = 10;

    const rollBlockTarget = Math.random() * 100;

    if (rollBlockTarget <= blockChance) {
      return true;
    } else {
      return false;
    }
  } else {
    //Defender has a shield and attempts to block.
    let skillDiff = defender.block - Math.floor(attacker[attackSkill] / 2);
    //Calc block penalty if blocker skill < shield block req
    if (defenderShield.skillReq && defenderShield.skillReq > defender.block) {
      const penalty = defenderShield.skillReq - defender.block;
      skillDiff -= penalty * 2;
    }

    let blockChance;
    if (skillDiff >= 40) blockChance = 95;
    else if (skillDiff >= 20) blockChance = 80;
    else if (skillDiff >= 10) blockChance = 70;
    else if (skillDiff >= 0) blockChance = 60;
    else if (skillDiff >= -10) blockChance = 50;
    else if (skillDiff >= -20) blockChance = 35;
    else if (skillDiff >= -30) blockChance = 20;
    else blockChance = 10;

    const rollBlockTarget = Math.random() * 100;

    if (rollBlockTarget <= blockChance) {
      return true;
    } else {
      return false;
    }
  }
}

//Encapsulates half a turn: Attacker makes an attack and the defender responds.
export function combatAction(
  attacker,
  attackerWeapon,
  defender,
  defenderShield,
  defenderArmour,
  defenderWeapon,
) {
  const damage = doDamage(attackerWeapon, attacker.strength);
  const attackHits = makeAttack(attacker, defender, attackerWeapon);
  const criticalHit = isCritical();

  let finalDamage = 0;
  let blocked = false;
  let damageReduction = defenderArmour?.damageReduction || 0;

  if (criticalHit) {
    damageReduction = 0;
    finalDamage = Math.floor(damage * 1.5); //Damage multiplier on critical hit! Always hits, bypasses all dmg reduction and block.
  } else if (!criticalHit && attackHits) {
    blocked = attemptBlock(
      attacker,
      defender,
      defenderShield,
      attackerWeapon,
      defenderWeapon,
    );
    if (blocked) {
      if (isWeaponTwoHanded(defenderWeapon)) {
        damageReduction += 2; //Two-handed weapons reduce incoming damage by 2 on a successful block, this will need TWEAKING.
      } else {
        damageReduction += defenderShield?.blockValue || 0;
      }
    }

    finalDamage = applyDamageReduction(damage, damageReduction);
  }

  return {
    damage,
    finalDamage,
    attackHits,
    blocked,
    criticalHit,
    damageReduction,
  };
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
  let heroWon;
  let rewards = { gold: 0, xp: 0 };
  let heroHP = hero.hp_current;
  let monsterHP = monster.hp;
  let turnCounter = 1;

  //Push combat start to log
  combatLog.push(
    addLogEntry("combat_start", {
      hero: hero.hero_name,
      monster: monster.name,
      monsterLevel: monster.level,
    }),
  );

  while (heroHP > heroRetreatsAt && monsterHP > 0) {
    //Stores the actions/ events of each turn and gets pushed to the combatLog at the end of each loop.
    const turn = {
      number: turnCounter,
      actions: [],
    };

    /* ===== Fatigue Checks ===== */
    if (monster.fatigue < turnCounter) {
      const getReward = giveRewards(monster, hero);
      rewards.gold = getReward.gold;
      rewards.xp = getReward.xp;

      turn.actions.push(
        addLogEntry("fatigue", {
          fighter: monster.name,
          fighterType: "monster",
        }),
      );
      turn.actions.push(
        addLogEntry("defeat", {
          defeated: monster.name,
          defeatedType: "monster",
          victor: hero.hero_name,
        }),
      );
      combatLog.push(addLogEntry("turn", turn));
      combatLog.push(
        addLogEntry("combat_end", {
          result: "victory",
          turns: turnCounter,
          hero: hero.hero_name,
          monster: monster.name,
          rewards: { gold: rewards.gold, xp: rewards.xp },
        }),
      );
      heroWon = true;
      break;
    }
    if (heroFatigue < turnCounter) {
      turn.actions.push(
        addLogEntry("fatigue", {
          fighter: hero.hero_name,
          fighterType: "hero",
        }),
      );
      turn.actions.push(
        addLogEntry("defeat", {
          defeated: hero.hero_name,
          defeatedType: "hero",
          victor: monster.name,
          slain: heroHP <= 0,
        }),
      );
      combatLog.push(addLogEntry("turn", turn));
      combatLog.push(
        addLogEntry("combat_end", {
          result: heroHP <= 0 ? "death" : "retreat",
          turns: turnCounter,
          hero: hero.hero_name,
          monster: monster.name,
        }),
      );
      heroWon = false;
      break;
    }

    const heroGoesFirst = determineInitiative(
      hero.initiative,
      monster.initiative,
    );

    turn.actions.push(
      addLogEntry("initiative", {
        fighter: heroGoesFirst ? hero.hero_name : monster.name,
        fighterType: heroGoesFirst ? hero.hero_name : monster.name,
      }),
    );

    if (heroGoesFirst) {
      //Player hero won initiative and attacks first.
      const heroAttack = combatAction(
        hero,
        heroEquipment.main_hand,
        monster,
        monster.shield,
        monster.armour,
        monster.weapon,
      );

      const monsterGotHit = heroAttack.attackHits;

      turn.actions.push(
        addLogEntry("attack", {
          attacker: hero.hero_name,
          attackerType: "hero",
          defender: monster.name,
          defenderType: "monster",
          weapon: heroEquipment.main_hand.name,
          hit: heroAttack.attackHits,
          blocked: heroAttack.blocked,
          shield: monster.shield?.name || monster.weapon?.name || null,
          baseDamage: heroAttack.damage,
          damage: heroAttack.finalDamage,
          damageReduction: heroAttack.damageReduction,
          critical: heroAttack.criticalHit,
        }),
      );
      if (heroAttack.criticalHit || heroAttack.attackHits) {
        monsterHP -= heroAttack.finalDamage;

        if (monsterHP <= 0) {
          const getReward = giveRewards(monster, hero);
          rewards.gold = getReward.gold;
          rewards.xp = getReward.xp;

          turn.actions.push(
            addLogEntry("defeat", {
              defeated: monster.name,
              defeatedType: "monster",
              victor: hero.hero_name,
            }),
          );

          combatLog.push(addLogEntry("turn", turn));
          combatLog.push(
            addLogEntry("combat_end", {
              result: "victory",
              turns: turnCounter,
              hero: hero.hero_name,
              monster: monster.name,
              rewards: { gold: rewards.gold, xp: rewards.xp },
            }),
          );
          heroWon = true;
          break;
        }
      }
      /* ===== Monster Counter-Attacks ===== */
      //If the monster has a Two-handed weapon and already made a successful block, no counter-attack can be made.
      if (
        (isWeaponTwoHanded(monster.weapon) && !monsterGotHit) ||
        !isWeaponTwoHanded(monster.weapon)
      ) {
        const monsterAttack = combatAction(
          monster,
          monster.weapon,
          hero,
          heroEquipment.off_hand,
          heroEquipment.armour,
          heroEquipment.main_hand,
        );

        turn.actions.push(
          addLogEntry("attack", {
            attacker: monster.name,
            attackerType: "monster",
            defender: hero.hero_name,
            defenderType: "hero",
            weapon: monster.weapon.name,
            hit: monsterAttack.attackHits,
            blocked: monsterAttack.blocked,
            shield:
              heroEquipment.off_hand?.name ||
              heroEquipment.main_hand?.name ||
              null,
            baseDamage: monsterAttack.baseDamage,
            damage: monsterAttack.finalDamage,
            damageReduction: monsterAttack.damageReduction,
            critical: monsterAttack.criticalHit,
          }),
        );

        if (monsterAttack.criticalHit || monsterAttack.attackHits) {
          heroHP -= monsterAttack.finalDamage;

          if (heroHP <= heroRetreatsAt) {
            turn.actions.push(
              addLogEntry("defeat", {
                defeated: hero.hero_name,
                defeatedType: "hero",
                victor: monster.name,
                slain: heroHP <= 0,
              }),
            );

            combatLog.push(addLogEntry("turn", turn));
            combatLog.push(
              addLogEntry("combat_end", {
                result: heroHP <= 0 ? "death" : "retreat",
                turns: turnCounter,
                hero: hero.hero_name,
                monster: monster.name,
              }),
            );
            heroWon = false;
            break;
          }
        }
      }
    } else {
      // === MONSTER ATTACKS FIRST ===
      const monsterAttack = combatAction(
        monster,
        monster.weapon,
        hero,
        heroEquipment.off_hand,
        heroEquipment.armour,
        heroEquipment.main_hand,
      );
      const heroGotHit = monsterAttack.attackHits;

      turn.actions.push(
        addLogEntry("attack", {
          attacker: monster.name,
          attackerType: "monster",
          defender: hero.hero_name,
          defenderType: "hero",
          weapon: monster.weapon.name,
          hit: monsterAttack.attackHits,
          blocked: monsterAttack.blocked,
          shield:
            heroEquipment.off_hand?.name ||
            heroEquipment.main_hand?.name ||
            null,
          baseDamage: monsterAttack.baseDamage,
          damage: monsterAttack.finalDamage,
          damageReduction: monsterAttack.damageReduction,
          critical: monsterAttack.criticalHit,
        }),
      );

      if (monsterAttack.criticalHit || monsterAttack.attackHits) {
        heroHP -= monsterAttack.finalDamage;

        if (heroHP <= heroRetreatsAt) {
          turn.actions.push(
            addLogEntry("defeat", {
              defeated: hero.hero_name,
              defeatedType: "hero",
              victor: monster.name,
              slain: heroHP <= 0,
            }),
          );

          combatLog.push(addLogEntry("turn", turn));
          combatLog.push(
            addLogEntry("combat_end", {
              result: heroHP <= 0 ? "death" : "retreat",
              turns: turnCounter,
              hero: hero.hero_name,
              monster: monster.name,
            }),
          );
          heroWon = false;
          break;
        }
      }

      // === HERO COUNTER-ATTACKS ===
      if (
        (isWeaponTwoHanded(heroEquipment.main_hand) && !heroGotHit) ||
        !isWeaponTwoHanded(heroEquipment.main_hand)
      ) {
        const heroAttack = combatAction(
          hero,
          heroEquipment.main_hand,
          monster,
          monster.shield,
          monster.armour,
          monster.weapon,
        );

        turn.actions.push(
          addLogEntry("attack", {
            attacker: hero.hero_name,
            attackerType: "hero",
            defender: monster.name,
            defenderType: "monster",
            weapon: heroEquipment.main_hand.name,
            hit: heroAttack.attackHits,
            blocked: heroAttack.blocked,
            shield: monster.shield?.name || monster.weapon?.name || null,
            baseDamage: heroAttack.baseDamage,
            damage: heroAttack.finalDamage,
            damageReduction: heroAttack.damageReduction,
            critical: heroAttack.criticalHit,
          }),
        );

        if (monsterAttack.criticalHit || heroAttack.attackHits) {
          monsterHP -= heroAttack.finalDamage;

          if (monsterHP <= 0) {
            const getReward = giveRewards(monster, hero);
            rewards.gold = getReward.gold;
            rewards.xp = getReward.xp;

            turn.actions.push(
              addLogEntry("defeat", {
                defeated: monster.name,
                defeatedType: "monster",
                victor: hero.hero_name,
              }),
            );

            combatLog.push(addLogEntry("turn", turn));
            combatLog.push(
              addLogEntry("combat_end", {
                result: "victory",
                turns: turnCounter,
                hero: hero.hero_name,
                monster: monster.name,
                rewards: { gold: rewards.gold, xp: rewards.xp },
              }),
            );
            heroWon = true;
            break;
          }
        }
      }
    }
    combatLog.push(addLogEntry("turn", turn));
    turnCounter++;
  }

  const result = { combatLog, heroHP, turnCounter, rewards, heroWon };
  return result;
}
