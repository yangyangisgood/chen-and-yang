<template>
  <div class="container">
    <h1>首頁</h1>
    <div class="button-container">
      <button @click="$router.push('/todo-list')">待辦清單</button>
      <button @click="$router.push('/dating-diary')">約會日記</button>
      <button @click="$router.push('/discussion-record')">吵架紀錄冊</button>
      <button @click="$router.push('/check-list')">關係檢查表</button>
    </div>

    <!-- 天數計數器 -->
    <div id="days-counter">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="calendar-icon"
        viewBox="0 0 16 16"
      >
        <path
          d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"
        />
      </svg>
      <span class="calendar-text">
        <span id="days-count">D+{{ daysCount }}</span>
      </span>
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

h1 {
  text-align: center;
  letter-spacing: 0.1em;
  color: #333;
  font-size: 1.6em;
  margin: 1.4em 0 1em 0;
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
  font-family: "sweiHalfMoonCJKtc-medium";
}

#days-counter {
  position: fixed;
  top: 8%;
  right: 8%;
}

.calendar-icon {
  height: 2.2em;
  transform: scaleX(1.5);
  fill: #333;
}

#days-count {
  position: absolute;
  top: 56%;
  left: 50%;
  transform: translate(-50%, -52%);
  font-size: 0.72em;
  color: #333;
  pointer-events: none;
  font-family: "SweiHalfMoonCJKtc-bold", Arial, sans-serif;
}
</style>
