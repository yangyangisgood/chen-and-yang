<template>
  <PageBasic color1="#eee" color2="#eee">
    <HeaderBasic
      title="交往前討論"
      page-color="values"
      style="margin-bottom: 0.8em"
    />
    <div class="ques-list">
      <div v-for="category in data" :key="category.cate" class="category">
        <h2 class="category-title">{{ category.title }}</h2>

        <div v-for="q in category.ques" :key="q.no" class="question-card">
          <h3 class="question-title">{{ q.no }}. {{ q.title }}</h3>

          <div class="answers">
            <div class="answer-block chen">
              <h4>陳</h4>
              <p v-html="q.chen"></p>
            </div>
            <div class="answer-block yang">
              <h4>洋</h4>
              <p v-html="q.yang"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageBasic>
</template>

<script setup lang="ts">
import { data } from "./data";
</script>

<style scoped>
.page-title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.ques-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}

.category {
  margin-bottom: 3rem;
}

.category-title {
  position: sticky;
  top: 0; /* 吸附在滾動容器頂端 */
  background: #eee; /* 背景色要跟頁面相符，避免文字透明壓到下面 */
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0; /* 避免吸附時抖動 */
  padding: 0.5rem 0;
  color: #444;
  z-index: 2; /* 保證在卡片上方 */
  border-top: 1.4px solid #666;
  border-bottom: 1.4px solid #666;
  text-align: center;
}

.question-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  margin-bottom: 1rem;
  margin-top: 1em;
}

.question-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.answers {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.answer-block {
  flex: 1 1 45%;
  background: #f8f9fa;
  padding: 0.8rem;
  border-radius: 6px;
}

.answer-block h4 {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.answer-block p {
  white-space: pre-line;
  line-height: 1.5;
}

.answer-block.chen {
  border-left: 4px solid #ffdc9a;
}

.answer-block.yang {
  border-left: 4px solid #9ac6ff;
}

@media (max-width: 768px) {
  .answer-block {
    flex: 1 1 100%;
  }
}

:deep(mark-strong) {
  background-color: #f1edc1; /* 螢光筆黃色 */
  padding: 0 2px; /* 讓背景左右留點空間 */
  border-radius: 2px; /* 圓角 */
}
</style>
