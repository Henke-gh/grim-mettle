<script setup>
const { hero, heroAvatar, loading, error, fetchHero } = useHero();
onMounted(() => {
  fetchHero();
})
</script>

<template>
  <div class="container" v-if="hero">
    <div class="hero">
      <img :src="heroAvatar.src" class="heroPortraitSmall" :alt="heroAvatar.alt" />
    </div>
    <div class="stats">
      <p class="noMargin">Name: {{ hero.hero_name }}</p>
      <p class="noMargin">Level: {{ hero.level }} ({{ hero.xp_current }} / {{ hero.xp_next_lvl }})</p>
      <p class="noMargin">HP: {{ hero.hp_current }} / {{ hero.hp_max }}</p>
      <p class="noMargin">Grit: {{ hero.grit_current }} / {{ hero.grit_max }}</p>
      <p class="noMargin">Gold: {{ hero.gold }}</p>
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
  background-color: var(--yellow);
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
</style>
