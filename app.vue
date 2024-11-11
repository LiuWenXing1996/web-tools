<template>
  <div id="app">
    <n-dialog-provider>
      <NuxtPage />
    </n-dialog-provider>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>
