//Special combat-mode. Used for fights against multiple enemies. Awards greater rewards.

//Determine attack order (each round)
function determineInitiative(heroInit, monsterOneInit, monsterTwoInit) {
  //Handles initiative for 2v1 combat.
  if (monsterTwoInit !== undefined) {
    const heroInitiative = Math.floor(Math.random() * (heroInit - 0 + 1));
    const monsterOneInitiative = Math.floor(
      Math.random() * (monsterOneInit - 0 + 1)
    );
    const monsterTwoInitiative = Math.floor(
      Math.random() * (monsterTwoInit - 0 + 1)
    );

    if (
      heroInitiative >= monsterOneInitiative &&
      heroInitiative >= monsterTwoInitiative
    ) {
      return 1;
    } else if (
      heroInitiative < monsterOneInitiative &&
      heroInitiative >= monsterTwoInitiative
    ) {
      return 2;
    } else if (
      heroInitiative >= monsterOneInitiative &&
      heroInitiative < monsterTwoInitiative
    ) {
      return 3;
    } else if (
      heroInitiative < monsterOneInitiative &&
      monsterOneInitiative < monsterTwoInitiative
    ) {
      return 3;
    } else {
      return 2;
    }
    //classic 1v1 initiative calculation
  } else {
    const heroInitiative = Math.floor(Math.random() * (heroInit - 0 + 1));
    const monsterInitiative = Math.floor(
      Math.random() * (monsterOneInit - 0 + 1)
    );
    if (heroInitiative >= monsterInitiative) {
      return 1;
    } else {
      return 2;
    }
  }
}

//REWARDS - Copy/Pasted from regular monster combat. NOT FINAL.
//Rework to match requirements for Prize Fight rewards (gold, items, stats? and xp).
function givePrize(monster, hero) {
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

export function doPrizeFight(
  hero,
  heroEquipment,
  retreatValue,
  henchmanOne,
  henchmanTwo,
  finalBoss
) {
  //1. Fight begins as a 2v1 with the Hero facing the two henchmen.
  //1.5 Upon defeating a henchman the Hero regains a portion of their max HP.
  //2. Upon defeating both henchmen the Final Boss-monster joins the fight and it resolves as a regular 1v1 fight.
}
