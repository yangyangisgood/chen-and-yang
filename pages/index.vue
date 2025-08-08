<template>
  <div class="container">
    <div class="header">
      <div></div>
      <h1>首頁</h1>
      <!-- 天數計數器 -->
      <div
        id="days-counter"
        @click="$router.push('/values')"
        style="cursor: pointer"
      >
        <span id="days-count">D+{{ daysCount }}</span>
      </div>
    </div>
    <div class="button-container">
      <button @click="$router.push('/todo-list')">待辦清單</button>
      <button @click="$router.push('/dating-diary')">約會日記</button>
      <button @click="$router.push('/discussion-record')">吵架紀錄冊</button>
      <button @click="$router.push('/check-list')">關係檢查表</button>
      <button @click="$router.push('/sushi-doesnt-go-round')">
        不迴轉壽司
      </button>
    </div>
  </div>
</template>

<script setup>
const daysCount = ref(0);

function calcDays() {
  const start = new Date("2025-07-14");
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = today - start;
  daysCount.value = Math.floor(diff / (1000 * 60 * 60 * 24));
}

onMounted(() => {
  calcDays();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 400px;
  padding: 1.5em 0.8em 2em 0.8em;
  margin: 0 auto;
  animation: content-anim 1500ms 500ms 1 forwards;
  background: linear-gradient(110deg, #eee 52%, #ccc 52%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  margin-top: 1.4em;
}

h1 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 1.6em;
  color: #333;
}

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

button {
  margin: 0.5em 1.6em;
  border-radius: 1.4em;
  height: 3em;
  font-size: 1.6em;
  color: #333;
  background-color: #eee;
}

#days-count {
  font-size: 1.1em;
  color: #333;
  pointer-events: none;
  font-family: "SweiHalfMoonCJKtc-bold", Arial, sans-serif;
  margin-right: 0.8em;
}
</style>
