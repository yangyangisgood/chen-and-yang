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
    <img src="/image/egg.png" id="egg" @click="dialogEggVisible = true" />
  </div>

  <el-dialog v-model="dialogEggVisible" title="你找到彩蛋了" width="90%" center>
    <div>
      <p>謝謝你，</p>
      <p>
        我們完成了
        <mark-strong>{{ listData.check }}次關係檢查表</mark-strong>
        ，謝謝你這{{ listData.check }}個多月的陪伴。
      </p>
      <p>我們爭吵過{{ listData.discussion }}次並和好。</p>
      <p>
        我們約定了
        <mark-strong>
          {{ listData.todo.true + listData.todo.false }}個要一起完成
        </mark-strong>
        的小事。目前完成了{{ listData.todo.false }}件，還有{{
          listData.todo.true
        }}件我們之後一起慢慢達成吧！
        <mark-strong>我們來日方長！</mark-strong>
      </p>
      <p>
        我們記錄了
        <mark-strong>{{ listData.dating }}次約會</mark-strong>
        ，期待還有更多，大概再{{ listData.dating * 100 }}次！
      </p>
      <p>謝謝你！有你真好，真的只想這麼說。</p>
    </div>
  </el-dialog>
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

const dialogEggVisible = ref(false);
const listData = ref();

function handleCountAch() {
  fetch(`${API_PATH}?action=countAch`)
    .then((res) => res.json())
    .then((data) => {
      listData.value = data;
    })
    .catch(() => console.log("載入失敗"));
}

onMounted(() => {
  calcDays();
  handleCountAch();
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

#egg {
  width: 8%;
  transform: rotate(-10deg);
  animation: egg-anim 1s 3000ms infinite alternate linear;
}

:deep(mark-strong) {
  background-color: #cfeff1; /* 螢光筆黃色 */
  border-radius: 2px; /* 圓角 */
}

p {
  color: #666;
}

@keyframes egg-anim {
  0% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(10deg);
  }
}
</style>
