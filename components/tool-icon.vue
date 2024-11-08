<template>
    <component v-if="tool" :is="tool.icon" />
</template>
<script setup lang="ts">
const props = defineProps<{
    name: string
}>()
const tool = computed(() => {
    return findTool(props.name)
})
</script>