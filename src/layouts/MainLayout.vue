<template>
  <div class="container">
    <TheHeader />
    <TheSidebar />
    <section class="content_container">
      <slot />
    </section>
  </div>
</template>

<script setup>
import TheSidebar from "../components/TheSidebar.vue";
import TheHeader from "../components/TheHeader.vue";
</script>

<style scoped lang="scss">
  
</style>
