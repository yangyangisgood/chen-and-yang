<template>
  <PageBasic color1="#f5e0d6" color2="#f3c1ad">
    <HeaderBasic title="吵架紀錄" page-color="discussion-record" />
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
    <LoaderBasic :visible="loading" color="#7c3a3a" />
  </PageBasic>
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
  max-height: calc(100vh - 180px);
  overflow-y: auto;
}
.argue-item {
  margin: 0.5em 0;
  padding: 0.6em 1em;
  background-color: #fff0f0;
  border: 1px solid #a86c6c;
  border-radius: 6px;
  cursor: pointer;
}
</style>
