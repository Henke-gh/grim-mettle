import { defineStore } from "pinia";
import { heroAvatars } from "../../utils/avatars";

export const useHeroCreateStore = defineStore("heroCreate", {
  state: () => ({
    currentStep: 1,
    totalSteps: 2,
    name: "",
    avatar: 0,
    stats: {
      strength: 0,
      speed: 0,
      vitality: 0,
      swords: 0,
      axes: 0,
      hammers: 0,
      spears: 0,
      daggers: 0,
      block: 0,
      evasion: 0,
      initiative: 0,
    },
    statPointsRemaining: 75,
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
    getCreatePayload() {
      // Only send what the API needs
      return {
        name: this.name,
        avatar: this.avatar,
        stats: Object.fromEntries(
          Object.entries(this.stats).map(([k, v]) => [k, Number(v)])
        ),
      };
    },
    reset() {
      this.$reset();
    },
  },
});
