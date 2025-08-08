<template>
  <PageBasic color1="#e6fcee" color2="#cef6df">
    <HeaderBasic title="約會日記" page-color="dating-diary" />

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
            style="width: 16em"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-cloud-upload"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"
              />
              <path
                fill-rule="evenodd"
                d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z"
              />
            </svg>
            <div class="el-upload__text">
              <em style="color: #666">點此選擇圖片</em>
            </div>
          </el-upload>
          <img
            v-if="form.imageUrl"
            :src="form.imageUrl"
            style="margin-top: 10px; max-width: 80%"
          />
        </el-form-item>

        <div style="text-align: right; margin-top: 10px">
          <el-button @click="resetForm">清空</el-button>
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" native-type="submit" :loading="loading"
            >送出</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </PageBasic>

  <!-- loader -->
  <LoaderBasic :visible="loading" color="#257436" />
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

function resetForm() {
  form.value = { type: "", date: "", title: "", content: "", imageUrl: "" };
}

function formatDateToLocal(dateString) {
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  const utc8Date = new Date(d.getTime() + 8 * 60 * 60 * 1000);
  return utc8Date.toISOString().split("T")[0];
}

function loadData() {
  loading.value = true;
  resetForm();
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
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-right: 6px;
  padding-top: 6px;
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
</style>
