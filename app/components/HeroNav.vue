<script setup></script>

<template>
  <section class="container">
    <div class="linkWrap">
      <p>[Hero]</p>
      <img src="/heroIcon.svg" />
    </div>
    <div class="linkWrap">
      <p>[Combat]</p>
      <img src="/IconFrameCombat.svg" />
    </div>
    <div class="linkWrap">
      <p>[Shop]</p>
      <img src="/IconFrameShopFirst.svg" />
    </div>
    <div class="linkWrap">
      <p>[Healing]</p>
      <img src="/healingIcon.svg" />
    </div>
    <div class="linkWrap">
      <p>[Tavern]</p>
      <img src="/tavernIcon.svg" />
    </div>
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
  z-index: 900;
  background-color: var(--yellow);
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
