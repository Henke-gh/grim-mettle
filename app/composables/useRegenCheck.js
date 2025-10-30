export const useRegenCheck = () => {
  //Checks current stored hero.last_regen, if 3 minutes old or older, allow update.
  const needsRegen = (lastRegen) => {
    const lastUpdate = new Date(lastRegen).getTime();
    const currentTime = Date.now();
    const minutesBetweenUpdates = 3;

    return currentTime - lastUpdate >= minutesBetweenUpdates * 60 * 1000;
  };

  //Make a server-side update request if update is due.
  const checkAndTriggerRegen = async (hero) => {
    //No hero, no update.
    if (!hero.id) return;
    //Last update is less than 3 minutes ago, no update. Such denial.
    if (!needsRegen(hero.last_regen)) return;

    const response = await $fetch("/api/hero/regen", {
      method: "POST",
      body: { heroId: hero.id },
    });

    return response;
  };
  return { needsRegen, checkAndTriggerRegen };
};
