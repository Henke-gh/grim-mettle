<script setup>
const { hero, heroAvatar, loading, error, fetchHero, canLevelUp } = useHero();
const { checkAndTriggerRegen } = useRegenCheck();
const showGameMenu = ref(false);

function toggleGameMenu() {
  showGameMenu.value = true;
}

function closeGameMenu() {
  showGameMenu.value = false;
}

onMounted(async () => {
  await fetchHero();
  const response = await checkAndTriggerRegen(hero.value);

  if (response?.regenerated) {
    await fetchHero();
  }
})
</script>

<template>
  <div class="container" v-if="hero">
    <div class="hero">
      <img :src="heroAvatar.src" class="heroPortraitSmall" :alt="heroAvatar.alt" />
    </div>
    <div class="levelUp" v-if="canLevelUp">
      <p>You&apos;ve gained a level!</p>
      <DefaultButton theme="light" text="Level Up" routeTo="/level-up" />
    </div>
    <div class="stats" v-if="!canLevelUp">
      <p class="noMargin">Name: {{ hero.hero_name }}</p>
      <p class="noMargin">Level: {{ hero.level }} ({{ hero.xp }} / {{ hero.xp_next_lvl }})</p>
      <p class="noMargin">HP: {{ hero.hp_current }} / {{ hero.hp_max }}</p>
      <p class="noMargin">Grit: {{ hero.grit_current }} / {{ hero.grit_max }}</p>
      <p class="noMargin">Gold: {{ hero.gold }}</p>
    </div>
    <div class="linksMenu" v-if="!showGameMenu">
      <button class="burgerBtn" @click="toggleGameMenu">
        <img src="/menuIcon_twist.svg" />
      </button>
      <p>Menu</p>
    </div>
    <GameNav :closeGameMenu="closeGameMenu" v-if="showGameMenu" />
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
  font-weight: 600;
  gap: 0.3rem;
}

.linksMenu {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
}

.burgerBtn {
  border: none;
  background: none;
}
</style>
