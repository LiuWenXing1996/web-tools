<template>
    <div class="h-full w-full">
        <span>确定删除 {{ name }} 吗？</span>
    </div>
</template>
<script setup lang="ts">
import type { ToolContentName } from '#imports';
const emits = defineEmits<{
    (e: 'successDel'): void
}>()
const props = defineProps<{
    name: ToolContentName
}>()
const delRequest = useCustomRequest(async () => {
    const res = await $fetch("/api/tool/del", {
        method: "POST",
        body: {
            name: props.name,
        }
    })
    emits("successDel")
    return res
})

defineExpose({
    delRequest
})
</script>
