<script setup>
const { hero, heroAvatar, loading, error, fetchHero, canLevelUp } = useHero();
const { checkAndTriggerRegen } = useRegenCheck();

onMounted(async () => {
  await fetchHero();
  const response = await checkAndTriggerRegen(hero.value);

  if (response?.regenerated) {
    await fetchHero();
  }
});
</script>

<template>
  <div class="container" v-if="hero">
    <NuxtLink to="/hero">
      <div class="hero">
        <img :src="heroAvatar.src" class="heroPortraitSmall" :alt="heroAvatar.alt" />
      </div>
    </NuxtLink>
    <div class="levelUp" v-if="canLevelUp">
      <p>You&apos;ve gained a level!</p>
      <DefaultButton theme="light" text="Level Up" routeTo="/level-up" class="fitContent" />
    </div>
    <div class="stats" v-if="!canLevelUp">
      <p class="noMargin">Name: {{ hero.hero_name }}</p>
      <p class="noMargin">Level: {{ hero.level }} ({{ hero.xp }} / {{ hero.xp_next_lvl }})</p>
      <p class="noMargin">HP: {{ hero.hp_current }} / {{ hero.hp_max }}</p>
      <p class="noMargin">Grit: {{ hero.grit_current }} / {{ hero.grit_max }}</p>
      <p class="noMargin">Gold: {{ hero.gold }}</p>
    </div>
    <div class="fixedMenu">
      <GameNav />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  position: fixed;
  top: 0;
  width: 100%;
  height: 6.5rem;
  padding-right: 3.5rem;
  background-color: var(--yellow);
  border-bottom: 5px double var(--bone-white);
  z-index: 5;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.noMargin {
  margin: 0;
}

.heroPortraitSmall {
  border-radius: 50%;
  border: 5px double var(--dark-green);
  height: 5rem;
  width: 5rem;
}

.levelUp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  gap: 0.5rem;
}

.fixedMenu {
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
}

@media only screen and (min-width: 650px) {
  .container {
    max-width: 650px;
    position: relative;
  }

  .fixedMenu {
    position: absolute;
  }
}
</style>
