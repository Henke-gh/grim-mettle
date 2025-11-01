import { defineStore } from "pinia";

export const useLevelUpStore = defineStore("heroLevelUp", {
  state: () => ({
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
    statPointsRemaining: 20,
  }),

  actions: {
    allocateStatPoints(stat, value) {
      const delta = Number(value) - this.stats[stat];
      if (this.statPointsRemaining - delta >= 0) {
        this.stats[stat] = Number(value);
        this.statPointsRemaining -= delta;
      }
    },
    getLevelUpPayload() {
      return {
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
