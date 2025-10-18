import { defineStore } from "pinia";
import { heroAvatars } from "../utils/avatars";

export const useHeroCreateStore = defineStore("heroCreate", {
  state: () => ({
    currentStep: 1,
    totalSteps: 2,
    name: "",
    avatar: 0, //Set default avatar
    level: 1,
    hp_current: 0,
    hp_max: 0, //computed value based on strength + vitality calculation.
    grit_current: 125,
    grit_max: 125,
    xp: 0,
    xp_next_lvl: 200, //Placeholder - not sure how this will be handled.
    gold: 150, //Also needs to be set properly and given a default starting amount.
    stats: {
      strength: 0,
      speed: 0,
      vitality: 0,
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
      this.name = heroName;
    },
    allocateStatPoints(stat, value) {
      const delta = Number(value) - this.stats[stat];
      if (this.statPointsRemaining - delta >= 0) {
        this.stats[stat] = Number(value);
        this.statPointsRemaining -= delta;
      }
    },
    reset() {
      this.$reset();
    },
  },
});
