<template>
  <div class="container">
    <HeaderBasic title="不迴轉壽司" page-color="sushi-doesnt-go-round" />

    <button class="add-btn" @click="openForm" :disabled="loading">
      捏一顆壽司
    </button>

    <div class="wood-background">
      <div class="sushi-grid">
        <div
          class="sushi-item"
          v-for="item in dataList"
          :key="item.id"
          @click="viewDetail(item)"
        >
          <img
            class="sushi-img"
            :src="getSushiImage(item.sushiType)"
            alt="壽司"
          />
        </div>
      </div>
    </div>

    <!-- 詳細 Dialog -->
    <el-dialog
      v-if="selected"
      v-model="dialogVisible"
      title="詳細內容"
      width="90%"
      :class="selected.sushiType === '鮭魚壽司加芥末' ? 'wasabi' : ''"
    >
      <div v-if="selected">
        <p><strong>🗓 日期：</strong>{{ selected.date }}</p>
        <p><strong>🧑 壽司師傅：</strong>{{ selected.user }}</p>
        <p><strong>📓 內容：</strong>{{ selected.content }}</p>
        <div style="margin-top: 1em; text-align: center">
          <el-button type="danger" @click="deleteItem">吃掉壽司</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 新增 Dialog -->
    <el-dialog v-model="formVisible" title="捏捏捏捏捏壽司" width="90%">
      <el-form @submit.prevent="submitForm" label-width="80px">
        <el-form-item label="壽司師傅">
          <el-select v-model="form.user" placeholder="你是誰">
            <el-option label="洋" value="洋" />
            <el-option label="陳" value="陳" />
          </el-select>
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
        <el-form-item label="項目">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="請輸入不爽的小事"
          />
        </el-form-item>
        <el-form-item label="壽司口味">
          <el-select v-model="form.sushiType" placeholder="選擇一種壽司">
            <el-option
              v-for="sushi in sushiOptions"
              :key="sushi.label"
              :label="sushi.label + sushi.emoji"
              :value="sushi.label"
            />
          </el-select>
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
  </div>

  <!-- loader -->
  <div id="loader" v-show="loading">
    <span class="loader-icon"></span>
    <span style="margin-left: 8px; color: #252c74">載入中...</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxCpBro8KBNZ_ObB8RaURjjC8oRmJ0DT08rcCzHiQelAe1Onrztax9fwLzUdb6QjWf8/exec";

const dataList = ref([]);
const dialogVisible = ref(false);
const formVisible = ref(false);
const loading = ref(false);
const selected = ref(null);
const form = ref({
  user: "",
  date: "",
  sushiType: "",
  content: "",
});

const sushiOptions = [
  { label: "小黃瓜捲", file: "cucumber.png", emoji: "🥒" },
  { label: "玉子燒壽司", file: "tamago.png", emoji: "🍳" },
  { label: "蝦壽司", file: "shrimp.png", emoji: "🍤" },
  { label: "干貝壽司", file: "scallop.png", emoji: "🦪" },
  { label: "鰻魚壽司", file: "eel.png", emoji: "⚡🐟" },
  { label: "鮪魚壽司", file: "tuna.png", emoji: "🐠" },
  { label: "鮭魚壽司", file: "salmon.png", emoji: "🍣" },
  { label: "鮭魚壽司加芥末", file: "salmon-wasabi.png", emoji: "🌶️🍣" },
];

function resetForm() {
  form.value = {
    user: "",
    date: "",
    sushiType: "",
    content: "",
  };
}

function getSushiImage(type) {
  const match = sushiOptions.find((s) => s.label === type);
  return match ? `/chen-and-yang/image/${match.file}` : "";
}

function loadData() {
  loading.value = true;
  resetForm();
  fetch(`${GAS_URL}?action=list`)
    .then((res) => res.json())
    .then((data) => (dataList.value = data.reverse()))
    .catch(() => ElMessage.error("載入失敗"))
    .finally(() => (loading.value = false));
}

function viewDetail(item) {
  selected.value = item;
  dialogVisible.value = true;
}

function openForm() {
  if (dataList.value.length >= 8) {
    ElMessage.error("最多八顆壽司！請先吃掉一些！");
    return;
  }
  formVisible.value = true;
}

function submitForm() {
  const payload = {
    ...form.value,
    id: Date.now(),
  };

  loading.value = true;
  fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        ElMessage.success("新增成功！");
        formVisible.value = false;
        loadData();
      } else {
        throw new Error();
      }
    })
    .catch(() => ElMessage.error("新增失敗"))
    .finally(() => (loading.value = false));
}

function deleteItem() {
  if (!selected.value) return;

  ElMessageBox.confirm("請先與伴侶討論，確定要吃掉壽司嗎？", "！！！！！", {
    confirmButtonText: "是的，可以吃掉了",
    cancelButtonText: "再想一下",
  })
    .then(() => {
      loading.value = true;

      fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "delete",
          id: selected.value.id,
        }),
        redirect: "follow",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            ElMessage.success("壽司已成功吃掉（消化中）🍣💨");
            dialogVisible.value = false;
            loadData();
          } else {
            throw new Error();
          }
        })
        .catch(() => ElMessage.error("刪除失敗，壽司還沒咽下去..."))
        .finally(() => {
          loading.value = false;
        });
    })
    .catch(() => {});
}

onMounted(loadData);
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  background-color: #eee;
  height: 100vh;
}

.add-btn {
  display: block;
  margin: 1em auto 1.2em;
  background-color: #b69964;
  color: white;
  padding: 0.5em 1.2em;
  border: none;
  border-radius: 8px;
  font-size: 1em;
}

.wood-background {
  background-image: url("/image/wood.png");
  /* background-size: cover; */
  background-repeat: repeat-y;
  background-position: center top;
  border-radius: 12px;
  min-height: 75vh;
  margin-bottom: 2em;
  padding-top: 1em;
}

.sushi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0;
}
.sushi-item {
  background-color: transparent;
  text-align: center;
  cursor: pointer;
}
.sushi-img {
  /* width: 7em; */
  height: 18vh;
  object-fit: contain;
  margin: 0 auto;
  display: block;
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
  border-top: 3px solid #64460f;
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
