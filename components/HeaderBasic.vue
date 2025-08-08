<template>
  <div class="header" :id="pageColor">
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
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  pageColor:
    | "check-list"
    | "todo-list"
    | "dating-diary"
    | "discussion-record"
    | "sushi-doesnt-go-round"
    | "values";
}>();
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
}

h1 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 1.6em;
}

.back-btn {
  border: none;
  padding: 0.53em 0em;
  display: flex;
  align-items: center;
  gap: 0.2em;
  font-size: 0.9em;
  cursor: pointer;
  background-color: transparent;
}

#check-list h1 {
  color: #304a68;
}
#check-list .back-btn {
  color: #304a68;
}

/* #todo-list h1 {
  color: #69491a;
}
#todo-list .back-btn {
  color: #69491a;
} */

#dating-diary h1 {
  color: #666;
}
#dating-diary .back-btn {
  color: #30685c;
}

#discussion-record h1 {
  color: #7c3a3a;
}
#discussion-record .back-btn {
  color: #7c3a3a;
}

#sushi-doesnt-go-round h1 {
  color: #333;
}
#sushi-doesnt-go-round .back-btn {
  color: #64460f;
}

#values h1 {
  color: #444;
}
#values .back-btn {
  color: #444;
}
</style>
