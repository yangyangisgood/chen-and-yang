<template>
  <div class="container">
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
    <h1>每月關係檢查表</h1>

    <!-- 新增按鈕 -->
    <button class="add-btn" @click="openForm" :disabled="loading">新增</button>

    <!-- 清單列表 -->
    <ul id="review-list">
      <li
        v-for="review in reviews"
        :key="review.timestamp + review.user"
        :class="['review-item', review.user === '洋' ? 'yang' : 'chen']"
        @click="viewDetail(review)"
      >
        <span>{{ review.user }}</span
        >｜<span>{{ formatDate(review.timestamp) }}</span>
      </li>
    </ul>

    <!-- 詳細 Dialog -->
    <el-dialog v-model="dialogVisible" title="檢視滿意度內容" width="90%">
      <div v-if="selected" class="dialog-content">
        <h3>🧡 Part 1：關係溫度計</h3>
        <p>
          <strong>滿足感：</strong><span>{{ selected.satisfaction }}</span>
        </p>
        <p>
          <strong>安全感：</strong><span>{{ selected.security }}</span>
        </p>
        <p>
          <strong>溝通：</strong><span>{{ selected.communication }}</span>
        </p>
        <p>
          <strong>快樂感：</strong><span>{{ selected.happiness }}</span>
        </p>
        <p>
          <strong>親密感：</strong><span>{{ selected.intimacy }}</span>
        </p>

        <h3>💬 Part 2：心事小抽屜</h3>
        <p>
          <strong>擔心的事：</strong><span>{{ selected.worry }}</span>
        </p>
        <p>
          <strong>開心時刻：</strong><span>{{ selected.happy_moment }}</span>
        </p>
        <p>
          <strong>偷偷在意：</strong><span>{{ selected.secret_care }}</span>
        </p>
        <p>
          <strong>最想說的話：</strong><span>{{ selected.say_to_you }}</span>
        </p>

        <h3>🧭 Part 3：小實驗</h3>
        <p>
          <strong>名稱：</strong><span>{{ selected.experiment_title }}</span>
        </p>
        <p>
          <strong>日期：</strong><span>{{ selected.experiment_date }}</span>
        </p>
        <p>
          <strong>期待感受：</strong
          ><span>{{ selected.experiment_expect }}</span>
        </p>
      </div>
    </el-dialog>

    <!-- 新增 Dialog -->
    <el-dialog v-model="formVisible" title="新增滿意度檢查表" width="90%">
      <el-form
        @submit.prevent="submitForm"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="我是誰">
          <el-radio-group v-model="form.user" required class="mb-2">
            <el-radio value="洋">洋</el-radio>
            <el-radio value="陳">陳</el-radio>
          </el-radio-group>
        </el-form-item>

        <h4>🧡 Part 1 關係溫度計</h4>
        <el-form-item label="滿足感">
          <el-rate v-model="form.satisfaction" />
        </el-form-item>
        <el-form-item label="安全感">
          <el-rate v-model="form.security" />
        </el-form-item>
        <el-form-item label="溝通">
          <el-rate v-model="form.communication" />
        </el-form-item>
        <el-form-item label="快樂感">
          <el-rate v-model="form.happiness" />
        </el-form-item>
        <el-form-item label="親密感">
          <el-rate v-model="form.intimacy" />
        </el-form-item>

        <h4>💬 Part 2 心事小抽屜</h4>
        <el-form-item label="擔心的事">
          <el-input v-model="form.worry" type="textarea" placeholder="請輸入" />
        </el-form-item>
        <el-form-item label="開心時刻">
          <el-input
            v-model="form.happy_moment"
            type="textarea"
            placeholder="請輸入"
          />
        </el-form-item>
        <el-form-item label="偷偷在意">
          <el-input
            v-model="form.secret_care"
            type="textarea"
            placeholder="請輸入"
          />
        </el-form-item>
        <el-form-item label="最想說的話">
          <el-input
            v-model="form.say_to_you"
            type="textarea"
            placeholder="請輸入"
          />
        </el-form-item>

        <h4>🧭 Part 3 小實驗</h4>
        <el-form-item label="小實驗名稱">
          <el-input v-model="form.experiment_title" placeholder="請輸入" />
        </el-form-item>
        <el-form-item label="實驗日期">
          <el-date-picker
            v-model="form.experiment_date"
            type="date"
            placeholder="請選擇日期"
          />
        </el-form-item>
        <el-form-item label="期待感受">
          <el-input
            v-model="form.experiment_expect"
            type="textarea"
            placeholder="請輸入"
          />
        </el-form-item>

        <div style="text-align: right; margin-top: 10px">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" native-type="submit" :loading="loading"
            >送出</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>

  <!-- loader -->
  <div id="loader" v-show="loading">
    <span class="loader-icon"></span>
    <span style="margin-left: 8px; color: #252c74">載入中...</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

const sheetUrl =
  "https://docs.google.com/spreadsheets/d/1duIugwMM6mYs_kPwtbMVgknKi0AzxFlwYeflzLSOHto/edit?usp=sharing";
const GAS_URL =
  "https://script.google.com/macros/s/AKfycby8G9-i8kk1KhSgLwSwtiBbR9rRg_3kS8xan2H-B3rFsLrU8NcmWzRBKivHi6D_fnSChw/exec";

const reviews = ref([]);
const dialogVisible = ref(false);
const formVisible = ref(false);
const selected = ref(null);
const loading = ref(false);
const form = ref({
  user: "",
  satisfaction: 0,
  security: 0,
  communication: 0,
  happiness: 0,
  intimacy: 0,
  worry: "",
  happy_moment: "",
  secret_care: "",
  say_to_you: "",
  experiment_title: "",
  experiment_date: "",
  experiment_expect: "",
});

function formatDate(str) {
  const [year, month] = str.split("-");
  return `${year} 年 ${Number(month) + 1} 月`;
}

function loadReviews() {
  loading.value = true;
  fetch(`${GAS_URL}?action=list`)
    .then((res) => res.json())
    .then((data) => {
      reviews.value = data.reverse();
    })
    .catch(() => ElMessage.error("載入失敗"))
    .finally(() => (loading.value = false));
}

function viewDetail(review) {
  selected.value = review;
  dialogVisible.value = true;
}

function getEffectiveTimestamp(today = new Date()) {
  const y = today.getFullYear();
  const m = today.getMonth(); // 0-based
  const start = new Date(y, m, 25); // 當月25號
  const end = new Date(y, m + 1, 10); // 下個月10號

  if (today >= start && today <= end) {
    return `${y}-${(m + 1).toString().padStart(2, "0")}`; // 傳當月
  }

  return null;
}

function openForm() {
  const ts = getEffectiveTimestamp();
  if (!ts) {
    ElMessage.error("只有當月25號～下個月10號之間可以新增資料");
    return;
  }

  formVisible.value = true;
  Object.assign(form.value, {
    user: "",
    satisfaction: 0,
    security: 0,
    communication: 0,
    happiness: 0,
    intimacy: 0,
    worry: "",
    happy_moment: "",
    secret_care: "",
    say_to_you: "",
    experiment_title: "",
    experiment_date: "",
    experiment_expect: "",
  });
}

function submitForm() {
  loading.value = true;
  const timestamp = getEffectiveTimestamp();
  const payload = {
    ...form.value,
    timestamp,
    experiment_date: form.value.experiment_date
      ? new Date(form.value.experiment_date).toISOString().split("T")[0]
      : "",
  };

  fetch(`${GAS_URL}?action=add`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
    redirect: "follow",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "success") {
        ElMessage.success("新增成功");
        formVisible.value = false;
        loadReviews();
      } else {
        throw new Error();
      }
    })
    .catch(() => ElMessage.error("新增失敗"))
    .finally(() => (loading.value = false));
}

onMounted(loadReviews);
</script>

<style scoped>
.container {
  height: 100vh;
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  background: linear-gradient(110deg, #e6f2fc 52%, #cee7f6 52%);
}
h1 {
  text-align: center;
  color: #304a68;
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
  color: #304a68;
  font-size: 0.9em;
  cursor: pointer;
  background-color: transparent;
}

.add-btn {
  display: block;
  margin: 1em auto;
  background-color: #869eb1;
  color: #eee;
  padding: 0.5em 1.2em;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  border: 2px solid #eee;
}
#review-list {
  list-style: none;
  padding: 0;
}
.review-item {
  margin: 0.5em 0;
  padding: 0.6em 1em;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95em;
  border: 1px solid #869eb1;
}
.review-item.yang {
  background-color: #cee7f6;
}
.review-item.chen {
  background-color: #e6f2fc;
}
.dialog-content p {
  margin-bottom: 0.5em;
  line-height: 1.6;
}
.dialog-content p span {
  display: inline-block;
  white-space: pre-wrap;
  word-break: break-word;
  background: #fff;
  padding: 4px 6px;
  border-radius: 4px;
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
  border-top: 3px solid #252c74;
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
