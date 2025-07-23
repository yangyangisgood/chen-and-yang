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
    <h1>約會日記</h1>

    <!-- 新增按鈕 -->
    <button class="add-btn" @click="openForm" :disabled="loading">新增</button>

    <!-- timeline 列表 -->
    <el-timeline class="timeline-box">
      <el-timeline-item
        v-for="item in timeline"
        :key="item.id"
        :timestamp="item.date"
        :color="item.type === '紀念日' ? '#86b1a3' : '#ccc'"
        @click="viewDetail(item)"
        class="timeline-item"
      >
        {{ item.title }}
      </el-timeline-item>
    </el-timeline>

    <!-- 詳細 Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="selected ? selected.title : 'no data'"
      width="90%"
    >
      <div v-if="selected" class="dialog-content">
        <p>
          <strong>日期：</strong><span>{{ selected.date }}</span>
        </p>
        <p>
          <strong>內容：</strong><span>{{ selected.content }}</span>
        </p>
        <img
          v-if="selected.imageUrl"
          :src="selected.imageUrl"
          alt="image"
          style="max-width: 50%; margin: 16px 25%"
        />
      </div>
    </el-dialog>

    <!-- 新增 Dialog -->
    <el-dialog v-model="formVisible" title="新增紀錄" width="90%">
      <el-form @submit.prevent="submitForm" label-width="80px">
        <el-form-item label="種類">
          <el-radio-group v-model="form.type">
            <el-radio value="紀念日">紀念日</el-radio>
            <el-radio value="約會">約會</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="請選擇日期"
          />
        </el-form-item>
        <el-form-item label="標題">
          <el-input v-model="form.title" placeholder="請輸入" />
        </el-form-item>
        <el-form-item label="內容">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="請輸入日記內容"
          />
        </el-form-item>
        <el-form-item label="上傳圖片">
          <el-upload
            v-if="!form.imageUrl"
            class="upload-demo"
            drag
            :http-request="uploadImage"
            :show-file-list="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <em>點此上傳</em>
            </div>
          </el-upload>
          <img
            v-if="form.imageUrl"
            :src="form.imageUrl"
            style="margin-top: 10px; max-width: 80%"
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

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyhV4INreTg9NfkTp3U72jtYXp8qIxCDiCbAKpsc-1222p67Foqe6isCxU7PYvTfebi5A/exec";

const timeline = ref([]);
const dialogVisible = ref(false);
const formVisible = ref(false);
const selected = ref(null);
const loading = ref(false);

const form = ref({
  type: "",
  date: "",
  title: "",
  imageUrl: "",
  content: "",
});

function formatDateToLocal(dateString) {
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  const utc8Date = new Date(d.getTime() + 8 * 60 * 60 * 1000);
  return utc8Date.toISOString().split("T")[0];
}

function loadData() {
  loading.value = true;
  fetch(GAS_URL)
    .then((res) => res.json())
    .then((data) => {
      timeline.value = data
        .filter((item) => item.date)
        .map((item) => ({
          ...item,
          date: formatDateToLocal(item.date),
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    })
    .catch(() => ElMessage.error("載入失敗"))
    .finally(() => (loading.value = false));
}

function viewDetail(item) {
  selected.value = item;
  dialogVisible.value = true;
}

function openForm() {
  formVisible.value = true;
  form.value = { type: "", date: "", title: "", content: "", imageUrl: "" };
}

function submitForm() {
  if (!form.value.type || !form.value.date || !form.value.content) {
    ElMessage.warning("請填寫所有欄位");
    return;
  }

  loading.value = true;
  const payload = {
    ...form.value,
    date: form.value.date,
    id: Date.now(),
    // imageUrl 是 uploadImage 成功後存進 form.value 的
    imageUrl: form.value.imageUrl || "", // 如果沒上傳就空字串
  };

  fetch(GAS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
    redirect: "follow",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        ElMessage.success("新增成功");
        formVisible.value = false;
        loadData();
      } else {
        throw new Error();
      }
    })
    .catch(() => ElMessage.error("新增失敗"))
    .finally(() => (loading.value = false));
}

// 修正後的 uploadImage 函數
async function uploadImage(option) {
  const file = option.file;

  // 將檔案轉換為 base64
  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // 移除 data:image/...;base64, 前綴
      const base64String = e.target.result.split(",")[1];
      resolve(base64String);
    };
    reader.readAsDataURL(file);
  });

  loading.value = true;
  try {
    const payload = {
      action: "upload",
      file: base64,
      filename: file.name,
      mimeType: file.type,
    };

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (json.url) {
      form.value.imageUrl = json.url;
      ElMessage.success("圖片上傳成功");
    } else {
      throw new Error("上傳失敗");
    }
  } catch (e) {
    console.error("上傳錯誤:", e);
    ElMessage.error("圖片上傳失敗");
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<style scoped>
.container {
  height: 100vh;
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  background: linear-gradient(110deg, #e6fcee 52%, #cef6df 52%);
}
h1 {
  text-align: center;
  color: #666;
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
  color: #30685c;
  font-size: 0.9em;
  cursor: pointer;
  background-color: transparent;
}
.add-btn {
  display: block;
  margin: 1em auto 2em;
  background-color: #86b1a3;
  color: #eee;
  padding: 0.5em 1.2em;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  border: 2px solid #eee;
}
.timeline-box {
  margin-top: 0.5em;
}
.timeline-item:hover {
  cursor: pointer;
  text-decoration: underline;
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
  border-top: 3px solid #257436;
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
