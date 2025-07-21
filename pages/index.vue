<template>
  <div class="container">
    <h1>home-page</h1>
    <div class="button-container">
      <button @click="$router.push('/todo-list')">待辦清單</button>
      <button @click="$router.push('/dating-diary')">dating-diary</button>
      <button @click="$router.push('/discussion-record')">
        discussion-record
      </button>
      <button @click="$router.push('/check-list')">關係檢查表</button>
    </div>
  </div>
</template>

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

h1 {
  text-align: center;
  letter-spacing: 0.1em;
  color: #333;
  font-size: 1.6em;
  margin: 1.4em 0 1em 0;
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
  font-family: "sweiHalfMoonCJKtc-medium";
}
</style>
