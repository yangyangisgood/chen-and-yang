<template>
  <div id="loader" v-show="visible">
    <span class="loader-icon" :style="{ borderTopColor: color }"></span>
    <span :style="{ marginLeft: '8px', color }">載入中...</span>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  color: {
    type: String,
    default: "#666",
  },
});
</script>

<style scoped>
#loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1em 2em;
  z-index: 9999;
  font-size: 1.03em;
  text-align: center;
}
.loader-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
  vertical-align: middle;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
