<template>
  <div
    class="container"
    :style="{
      background: `linear-gradient(110deg, ${color1} 52%, ${color2} 52%)`,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color1: string;
  color2: string;
}>();
</script>

<style scoped>
.container {
  height: 100vh;
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
}
</style>
