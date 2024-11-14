<template>
  <div id="app">
    <n-config-provider inline-theme-disabled :theme="theme.current.value">
      <n-global-style />
      <global-css-vars />
      <n-dialog-provider>
        <n-message-provider>
          <NuxtPage keepalive />
        </n-message-provider>
      </n-dialog-provider>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
const theme = useTheme()
</script>

<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;

  &.dark-mode {
    background-color: rgb(16, 16, 20);
  }

  &.light-mode {
    background-color: rgb(255, 255, 255);
  }
}

#app {
  height: 100vh;
  width: 100vw;
}

*,
::before,
::after {
  border-color: var(--naive-border-color);
}
</style>
