<template>
  <div id="app">
    <n-config-provider inline-theme-disabled>
      <n-global-style />
      <n-dialog-provider>
        <NuxtPage />
      </n-dialog-provider>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
useGlobalCssVars();
</script>

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
