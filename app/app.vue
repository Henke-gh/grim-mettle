<template>
  <div>
    <div class="imgLogo">
    <img src="/logo.svg"/>
    </div>
    <HeroNav/>
  </div>
</template>

<script>
import "./assets/main.css"
import "./components/HeroNav.vue"
</script>

<style lang="css" scoped>
.imgLogo{
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 20%;
  margin: 1rem;
}
</style>
