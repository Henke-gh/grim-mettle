import { defineStore } from "pinia";

export const useHeroCreateStore = defineStore("heroCreate", {
  state: () => ({
    heroName: "",
    avatar: null,
    level: 1,
    hitpoints: 0,
    maxHP: 0, //computed value based on strength + vitality calculation.
    grit: 0,
    maxGrit: 0, //computed value based on speed + vitality calculation.
    xp: 0,
    xpToLvlUp: 0, //Placeholder - not sure how this will be handled.
    gold: 0, //Also needs to be set properly and given a default starting amount.
    stats: {
      strength: 5, //default main attribute values at 5.
      speed: 5,
      vitality: 5,
      swords: 0, //skills start at zero
      axes: 0,
      hammers: 0,
      spears: 0,
      daggers: 0,
      block: 0,
      evasion: 0,
      initiative: 0,
    },
    statPointsRemaining: 75, // Points pool used on stats during hero creation
  }),

  actions: {
    setAvatar(avatar) {
      this.avatar = avatar;
    },
    setHeroName(heroName) {
      this.heroName = heroName;
    },
    allocateStatPoints(stat, value) {
      const delta = value - this.stats[stat];
      if (this.statPointsRemaining - delta >= 0) {
        this.stats[stat] = value;
        this.statPointsRemaining -= delta;
      }
    },
    reset() {
      this.$reset();
    },
  },
});
