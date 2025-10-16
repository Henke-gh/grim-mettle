import { defineStore } from "pinia";
import { heroAvatars } from "../utils/avatars";

export const useHeroCreateStore = defineStore("heroCreate", {
  state: () => ({
    currentStep: 1,
    totalSteps: 2,
    heroName: "Unknown Hero",
    avatar: 0, //Set default avatar
    level: 1,
    hitpoints: 0,
    maxHP: 0, //computed value based on strength + vitality calculation.
    grit: 125,
    maxGrit: 100, //computed value based on speed + vitality calculation.
    xp: 0,
    xpToLvlUp: 200, //Placeholder - not sure how this will be handled.
    gold: 150, //Also needs to be set properly and given a default starting amount.
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

  getters: {
    selectedAvatar: (state) => {
      return heroAvatars.find((match) => match.id === state.avatar);
    },
  },

  actions: {
    nextStep() {
      if (this.currentStep < this.totalSteps) this.currentStep++;
    },
    previousStep() {
      if (this.currentStep > 1) this.currentStep--;
    },
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
