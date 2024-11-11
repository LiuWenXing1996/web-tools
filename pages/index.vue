<template>
  <n-space>
    <n-button v-for="tool in tools">{{ tool.name }}
      {{ tool.meta?.description }}
    </n-button>
  </n-space>
</template>
<script setup lang="ts">
const tools = getAllTools()
</script>
