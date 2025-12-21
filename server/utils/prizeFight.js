//Special combat-mode. Used for fights against multiple enemies. Awards greater rewards.

//Determine attack order (each round)
function determineInitiative(heroInit, monsterOneInit, monsterTwoInit) {
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
  } else {
    return 3;
  }
}
