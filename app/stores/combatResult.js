import { defineStore } from "pinia";
export const useCombatResult = defineStore("combatResult", {
  state: () => ({
    combatLog: [],
  }),
});
