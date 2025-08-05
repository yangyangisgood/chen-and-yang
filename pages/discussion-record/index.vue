<template>
  <div class="container">
    <!-- 返回按鈕 -->
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

    <h1>吵架記錄</h1>
    <button class="add-btn" @click="openForm" :disabled="loading">新增</button>

    <ul id="argue-list">
      <li
        v-for="item in list"
        :key="item.timestamp"
        class="argue-item"
        @click="viewDetail(item)"
      >
        <strong>{{ item.title }}</strong
        >｜{{ item.date }}
      </li>
    </ul>

    <!-- 詳細 Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="selected ? selected.title : '詳細內容'"
      width="90%"
    >
      <div v-if="selected">
        <p><strong>🗓 日期：</strong>{{ selected.date }}</p>
        <p><strong>📄 內容：</strong>{{ selected.content }}</p>
        <p><strong>🐑 洋的想法：</strong>{{ selected.yang_thoughts }}</p>
        <p><strong>🧸 陳的想法：</strong>{{ selected.chen_thoughts }}</p>
        <p><strong>📌 結論：</strong>{{ selected.conclusion }}</p>
        <p v-if="selected.conclusion === '有共識與解決方法'">
          <strong>🛠 解決方案：</strong>{{ selected.solution }}
        </p>
      </div>
    </el-dialog>

    <!-- 新增 Dialog -->
    <el-dialog v-model="formVisible" title="新增吵架紀錄" width="90%">
      <el-form @submit.prevent="submitForm" label-width="90px">
        <el-form-item label="標題">
          <el-input v-model="form.title" placeholder="請輸入" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="請選擇日期"
          />
        </el-form-item>
        <el-form-item label="內容">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="請輸入"
          />
        </el-form-item>
        <el-form-item label="洋的想法">
          <el-input
            v-model="form.yang_thoughts"
            type="textarea"
            placeholder="請輸入"
          />
        </el-form-item>
        <el-form-item label="陳的想法">
          <el-input
            v-model="form.chen_thoughts"
            type="textarea"
            placeholder="請輸入"
          />
        </el-form-item>
        <el-form-item label="結論">
          <el-radio-group v-model="form.conclusion">
            <el-radio label="有共識與解決方法">有共識與解決方法</el-radio>
            <el-radio label="了解彼此想法">了解彼此想法</el-radio>
            <el-radio label="未解決待追蹤">未解決待追蹤</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="解決方案"
          v-if="form.conclusion === '有共識與解決方法'"
        >
          <el-input
            v-model="form.solution"
            type="textarea"
            placeholder="請輸入"
          />
        </el-form-item>
        <div style="text-align: right">
          <el-button @click="resetForm">清空</el-button>
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" native-type="submit" :loading="loading"
            >送出</el-button
          >
        </div>
      </el-form>
    </el-dialog>

    <!-- loader -->
    <div id="loader" v-show="loading">
      <span class="loader-icon"></span>
      <span style="margin-left: 8px; color: #252c74">載入中...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxn7DMZLJTLAVeKMpCC41fIsU8r3BxUJCM_8JiGbvG1lqsn_3BRyFmL1sTCNcE5lwGK/exec";
const list = ref([]);
const dialogVisible = ref(false);
const formVisible = ref(false);
const selected = ref(null);
const loading = ref(false);

const form = ref({
  title: "",
  date: "",
  content: "",
  yang_thoughts: "",
  chen_thoughts: "",
  conclusion: "",
  solution: "",
});

function resetForm() {
  form.value = {
    title: "",
    date: "",
    content: "",
    yang_thoughts: "",
    chen_thoughts: "",
    conclusion: "",
    solution: "",
  };
}

function formatDateToLocal(dateString) {
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  const utc8Date = new Date(d.getTime() + 8 * 60 * 60 * 1000);
  return utc8Date.toISOString().split("T")[0];
}

function loadList() {
  loading.value = true;
  resetForm();
  fetch(`${GAS_URL}?action=list`)
    .then((res) => res.json())
    .then((data) => {
      list.value = data.reverse().map((item) => ({
        ...item,
        date: formatDateToLocal(item.date),
      }));
    })
    .catch(() => ElMessage.error("載入失敗"))
    .finally(() => (loading.value = false));
}

function openForm() {
  formVisible.value = true;
}

function submitForm() {
  loading.value = true;
  const payload = { ...form.value, timestamp: Date.now() };
  fetch(`${GAS_URL}?action=add`, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "success") {
        ElMessage.success("新增成功");
        formVisible.value = false;
        loadList();
      } else throw new Error();
    })
    .catch(() => ElMessage.error("新增失敗"))
    .finally(() => (loading.value = false));
}

function viewDetail(item) {
  selected.value = item;
  dialogVisible.value = true;
}

onMounted(loadList);
</script>

<style scoped>
.container {
  height: 100vh;
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  background: linear-gradient(110deg, #f5e0d6 52%, #f3c1ad 52%);
}
h1 {
  text-align: center;
  color: #7c3a3a;
  font-size: 1.6em;
}
.back-btn {
  border: none;
  padding: 0.53em 1.1em;
  position: fixed;
  top: 2em;
  left: 0.2em;
  display: flex;
  align-items: center;
  gap: 0.2em;
  color: #7c3a3a;
  font-size: 0.9em;
  cursor: pointer;
  background-color: transparent;
}
.add-btn {
  display: block;
  margin: 1em auto;
  background-color: #a86c6c;
  color: #fff;
  padding: 0.5em 1.2em;
  border: none;
  border-radius: 5px;
  font-size: 1em;
}
#argue-list {
  list-style: none;
  padding: 0;
}
.argue-item {
  margin: 0.5em 0;
  padding: 0.6em 1em;
  background-color: #fff0f0;
  border: 1px solid #a86c6c;
  border-radius: 6px;
  cursor: pointer;
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
  border-top: 3px solid #7c3a3a;
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
