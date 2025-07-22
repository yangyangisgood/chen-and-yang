<template>
  <div :class="['container', { 'pink-mode': percent === 100 }]">
    <!-- 返回 -->
    <button class="back-btn" @click="$router.push('/')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-chevron-compact-left"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"
        />
      </svg>
      返回
    </button>

    <!-- title -->
    <h1>
      <a
        href="https://docs.google.com/spreadsheets/d/1MMnLWBfr-XKPe99Pm5mKrlj0aI1wpG2LPC8hPKLog2U/edit?usp=sharing"
        target="_blank"
      >
        待辦清單
      </a>
    </h1>

    <!-- 新增項目 form -->
    <form id="todo-form" autocomplete="off" @submit.prevent="addTodo">
      <input
        type="text"
        id="new-todo"
        placeholder="新增待辦..."
        v-model.trim="newTodo"
        :disabled="loading"
      />
      <button class="add-btn" type="submit" :disabled="loading">新增</button>
    </form>

    <!-- 待辦事項 todo list -->
    <ul id="todo-list">
      <li
        v-for="(todo, idx) in todos"
        :key="todo.id"
        :class="{ checked: isChecked(todo) }"
        @click="toggleTodo(idx)"
      >
        <span>{{ todo.content }}</span>
        <button
          class="del-btn"
          @click.stop="deleteTodo(todo.id)"
          :disabled="loading"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            class="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
            />
            <path
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
            />
          </svg>
        </button>
      </li>
    </ul>

    <!-- 進度條 progress bar -->
    <div id="progress-bar-container">
      <div id="progress-label">
        已完成 {{ doneCount }} / {{ todos.length }}（{{ percent }}%）
      </div>
      <div id="progress-bar">
        <div
          id="progress-bar-fill"
          :style="{
            width: percent + '%',
            backgroundColor: percent === 100 ? '#f39083' : '#69491A',
          }"
        ></div>
      </div>
    </div>

    <!-- deco -->
    <div class="deco-container">
      <img src="/image/f-orange.png" class="deco-items" id="orange-flower" />
      <img src="/image/f-pink.png" class="deco-items" id="pink-flower" />
    </div>

    <!-- loader -->
    <div id="loader" v-show="loading">
      <span class="loader-icon"></span>
      <span style="margin-left: 8px">載入中...</span>
    </div>

    <!-- 愛心動畫 -->
    <div id="heart-burst" :class="{ animate: heartAnimating }">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="heart-icon"
        viewBox="0 0 16 16"
        fill="#FF69B4"
      >
        <path
          d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbz_ls8nqd7ArsdeHJS2BotDasBAr4sP4O08LivCtdFswJPulsuswrnnQ7SrXW7hwxmi/exec";

const newTodo = ref("");
const todos = ref([]);
const loading = ref(false);
const heartAnimating = ref(false);

const doneCount = computed(
  () =>
    todos.value.filter((t) => t.checked === true || t.checked === "true").length
);
const percent = computed(() =>
  todos.value.length === 0
    ? 0
    : Math.round((doneCount.value / todos.value.length) * 100)
);

function isChecked(todo) {
  return todo.checked === true || todo.checked === "true";
}

function loadTodos() {
  loading.value = true;
  fetch(`${GAS_URL}?action=list`)
    .then((res) => res.json())
    .then((data) => {
      todos.value = data;
    })
    .catch(() => alert("載入失敗"))
    .finally(() => (loading.value = false));
}

function addTodo() {
  if (!newTodo.value) return;
  const tempId = "temp-" + Date.now();
  const todo = { id: tempId, content: newTodo.value, checked: false };
  todos.value.push(todo);
  newTodo.value = "";

  fetch(`${GAS_URL}?action=add&content=${encodeURIComponent(todo.content)}`)
    .then((res) => res.json())
    .then((data) => {
      const idx = todos.value.findIndex((t) => t.id === tempId);
      if (idx !== -1 && data.id) todos.value[idx].id = data.id;
    })
    .catch(() => {
      todos.value = todos.value.filter((t) => t.id !== tempId);
      alert("新增失敗");
    });
}

function toggleTodo(idx) {
  const todo = todos.value[idx];
  const old = todo.checked;
  todo.checked = !old;

  if (percent.value === 100) triggerHeart();

  fetch(`${GAS_URL}?action=update&id=${todo.id}&checked=${todo.checked}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.status !== "success") throw new Error();
    })
    .catch(() => {
      todo.checked = old;
      alert("更新失敗");
    });
}

function deleteTodo(id) {
  if (!confirm("確定刪除？")) return;
  const idx = todos.value.findIndex((t) => t.id === id);
  const del = todos.value[idx];
  todos.value.splice(idx, 1);

  fetch(`${GAS_URL}?action=delete&id=${id}`)
    .then((res) => res.json())
    .then((ret) => {
      if (ret.status !== "success") throw new Error();
    })
    .catch(() => {
      todos.value.splice(idx, 0, del);
      alert("刪除失敗");
    });
}

function triggerHeart() {
  heartAnimating.value = false;
  requestAnimationFrame(() => {
    heartAnimating.value = true;
  });
}

/* 解決瀏覽器畫面顯示問題 */
function adjustTodoListHeight() {
  const todoList = document.getElementById("todo-list");
  const progressBar = document.getElementById("progress-bar-container");
  const inputForm = document.getElementById("todo-form");
  const header = document.querySelector("h1");

  const topSpace = header.offsetHeight + inputForm.offsetHeight + 32;
  const bottomSpace = progressBar.offsetHeight + 46;
  const vh = window.innerHeight;

  const maxListHeight = vh - topSpace - bottomSpace;
  todoList.style.maxHeight = maxListHeight + "px";
  todoList.style.overflowY = "auto";
}

onMounted(() => {
  loadTodos();
  adjustTodoListHeight();
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
  background: linear-gradient(110deg, #ffd954 52%, #e4b660 52%);
}

h1 {
  text-align: center;
  letter-spacing: 0.1em;
  color: #69491a;
  font-size: 1.6em;
  margin-top: 0.6em;
}

a {
  text-decoration: none;
  color: #69491a;
}

form {
  display: flex;
  margin-bottom: 1em;
  gap: 4px;
}

input[type="text"] {
  flex: 1;
  padding: 0.68em;
  font-size: 1.05em;
  border: 1px solid #ccd;
  border-radius: 5px;
  outline: none;
  box-sizing: border-box;
}

button {
  border: none;
  color: #fff;
  font-size: 1em;
  padding: 0.53em 1.1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn {
  background: #60491a;
}

.del-btn {
  background: transparent;
  color: #69491a;
  margin-left: 0.8em;
  font-size: 0.99em;
  padding: 0.38em 1em;
}

ul {
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
  padding: 0 0 4em 1em;
  list-style: none;
}

li {
  margin-top: 0.2em;
  display: flex;
  align-items: center;
  border-radius: 7px;
  font-size: 1.08em;
  position: relative;
}

li.checked span {
  text-decoration: line-through;
  color: #bbb;
}

li span {
  flex: 1;
  margin-left: 0.6em;
  user-select: none;
  max-width: 78%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* white-space: normal;
  overflow-wrap: break-word; */
}

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
  border-top: 3px solid #69491a;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
  vertical-align: middle;
}

.back-btn {
  position: fixed;
  top: 2em;
  left: 0.2em;
  display: flex;
  align-items: center;
  gap: 0.2em;
  color: #69491a;
  font-size: 0.9em;
  cursor: pointer;
  background-color: transparent;
}

#orange-flower {
  display: block;
  position: fixed;
  top: 3%;
  right: 5%;
  height: 6%;
  transform: rotate(-5deg);
  animation: orange-flower-anim 3s 3000ms infinite alternate linear;
}

#pink-flower {
  display: none;
  position: fixed;
  top: 3%;
  right: 5%;
  height: 6%;
  transform: rotate(-23deg);
  animation: pink-flower-anim 3s 3000ms infinite alternate linear;
}

#progress-bar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 400px;
  margin: 0 auto;
  padding: 0.8em 1em;
  background: #f3e6bd;
  font-size: 0.9em;
  color: #69491a;
  z-index: 10;
}

#progress-label {
  margin-bottom: 0.2em;
}

#progress-bar {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
}

#progress-bar-fill {
  height: 100%;
  width: 0%;
  background-color: #69491a;
  transition: width 0.3s ease;
}

#heart-burst {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  z-index: 9999;
  pointer-events: none;
}

.heart-icon {
  width: 80px;
  height: 80px;
  fill: #f39083;
}

#heart-burst.animate {
  animation: heart-pop 1.2s ease-out forwards;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes content-anim {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

/* 手機斷點，可略微調整大小 */
@media (max-width: 340px) {
  body {
    max-width: 98vw;
  }

  h1 {
    font-size: 1.15em;
  }
}

@keyframes orange-flower-anim {
  0% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(20deg);
  }
}

@keyframes pink-flower-anim {
  0% {
    transform: rotate(-23deg);
  }
  100% {
    transform: rotate(2deg);
  }
}

@keyframes heart-pop {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }

  50% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 1;
  }

  100% {
    transform: translate(-50%, -50%) scale(12);
    opacity: 0;
  }
}

input:disabled,
button:disabled,
.del-btn:disabled {
  opacity: 0.55;
  pointer-events: none;
}

::-webkit-input-placeholder {
  color: #aaa;
}

::-moz-placeholder {
  color: #aaa;
}

::-ms-input-placeholder {
  color: #aaa;
}

::placeholder {
  color: #aaa;
}

/* pink-mode */
.container.pink-mode {
  background: linear-gradient(110deg, #ffd9dc 52%, #fbb4b8 52%);
  background-attachment: fixed;
  background-size: cover;
}

.container.pink-mode h1 {
  color: #f39083;
}

.container.pink-mode .add-btn {
  background-color: #f39083;
  border: 2px solid #faecea;
}

.container.pink-mode #progress-bar-container {
  background-color: #faecea;
}

.container.pink-mode #orange-flower {
  display: none;
}

.container.pink-mode #pink-flower {
  display: block;
}
</style>
