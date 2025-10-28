//Calculates hit damage, also needs to take monster/hero strength rating.
//Max and min values are inclusive when randomised.
export function doDamage(weapon) {
  const minDmg = Math.ceil(weapon.minDmg);
  const maxDmg = Math.floor(weapon.maxDmg);

  return Math.floor(Math.random() * (maxDmg - minDmg + 1) + minDmg);
}
