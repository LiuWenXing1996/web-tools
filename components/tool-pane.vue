<template>
    <div class="h-full w-full" v-loading="loading">
        <template v-if="tool">
            <component :is="tool.content"></component>
        </template>
        <template v-else>
            {{ `工具 ${name} 未实现` }}
        </template>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    name: string
}>()
const loading = computed(() => {
    return toolDetailRequest.loading.value
})
const toolDetailRequest = useCustomRequest(async () => {
    const res = await $fetch("/api/tool/detail", {
        params: {
            name: props.name
        }
    })
    return res
})
watch(() => props.name, () => {
    toolDetailRequest.refreshAsync()
}, {
    immediate: true
})
const tool = computed(() => {
    return findTool(props.name)
})
</script>