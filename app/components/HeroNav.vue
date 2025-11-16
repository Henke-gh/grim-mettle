<script setup></script>

<template>
  <section class="container">
    <NuxtLink to="/hero" style="text-decoration: none; color: var(--warm-black)">
      <div class="linkWrap">
        <p>[Hero]</p>
        <img src="/heroIcon.svg" />
      </div>
    </NuxtLink>
    <NuxtLink to="/arena" style="text-decoration: none; color: var(--warm-black);">
      <div class="linkWrap">
        <p>[Combat]</p>
        <img src="/IconFrameCombat.svg" />
      </div>
    </NuxtLink>
    <NuxtLink to="/market" style="text-decoration: none; color: var(--warm-black);">
      <div class="linkWrap">
        <p>[Market]</p>
        <img src="/IconFrameShopFirst.svg" />
      </div>
    </NuxtLink>
    <NuxtLink to="/healing" style="text-decoration: none; color: var(--warm-black);">
      <div class="linkWrap">
        <p>[Healing]</p>
        <img src="/healingIcon.svg" />
      </div>
    </NuxtLink>
    <NuxtLink to="/tavern" style="text-decoration: none; color: var(--warm-black);">
      <div class="linkWrap">
        <p>[Tavern]</p>
        <img src="/tavernIcon.svg" />
      </div>
    </NuxtLink>
  </section>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 0.5rem;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 650px;
  z-index: 60;
  background-color: var(--yellow);
  border-top: 5px double var(--bone-white);
}

.linkWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
}

.linkWrap p {
  margin-bottom: 0.3rem;
}
</style>
