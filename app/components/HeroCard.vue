<script setup>
const heroName = 'Toern'
</script>

<template>
  <div class="container">
    <div class="hero">
      <img src="/avatars/avatarOne.png" class="heroPortrait" />
      <p>Level: 2 (35 / 350)</p>
    </div>
    <div class="stats">
      <p>Name: {{ heroName }}</p>
      <p>HP: 35 / 35</p>
      <p>Grit: 55 / 70</p>
      <p>Gold: 230</p>
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
