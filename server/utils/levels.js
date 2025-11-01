const levelThresholds = {
  1: 75,
  2: 200,
  3: 325,
  4: 475,
  5: 650,
  6: 875,
  7: 1100,
  8: 1350,
  9: 1700,
  10: 2000,
  11: 2300,
  12: 2600,
  13: 2950,
  14: 3300,
  15: 3700,
  16: 4100,
  17: 4500,
  18: 4900,
  19: 5300,
  20: 6000,
  21: 6700,
  22: 7400,
  23: 8100,
  24: 8800,
  25: 13000,
};

export function getXpForNextLevel(currentLevel) {
  const nextLevel = currentLevel + 1;
  return levelThresholds[nextLevel] || null; // null if max level reached, needs a better solution down the line!
}
