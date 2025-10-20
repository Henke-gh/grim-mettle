<script setup>
const { hero, heroAvatar, loading, error, fetchHero } = useHero();
onMounted(() => {
  fetchHero();
})
</script>

<template>
  <div class="container" v-if="hero">
    <div class=" hero">
      <img :src="heroAvatar.src" class="heroPortrait" :alt="heroAvatar.alt" />
      <p>Level: 2 (35 / 350)</p>
    </div>
    <div class="stats">
      <p>Name: {{ hero.hero_name }}</p>
      <p>HP: {{ hero.hp_current }} / {{ hero.hp_max }}</p>
      <p>Grit: {{ hero.grit_current }} / {{ hero.grit_max }}</p>
      <p>Gold: {{ hero.gold }}</p>
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
  height: 9rem;
  background-color: var(--yellow);
  border-radius: 0.4rem;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero p {
  margin: 0;
  padding-bottom: 0.5rem;
}

.heroPortrait {
  border-radius: 50%;
  border: 4px dotted var(--purple);
  height: 6rem;
  width: 6rem;
  margin: 5px;
}
</style>
