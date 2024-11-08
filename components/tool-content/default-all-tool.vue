<template>
    <div>
        已注册所有工具
        <div v-for="tool in toolListRequest.data.value"
            class="flex items-center justify-center h-[44px] w-[44px] border hover:bg-primary cursor-pointer">
            {{ tool.name }}
        </div>
    </div>
</template>
<script setup lang="ts">
const toolListRequest = useCustomRequest(async () => {
    const res = await $fetch("/api/tool/list", {
        params: {
            pageSize: 10,
            pageIndex: 1
        }
    })
    console.log({ res })
    return res
})


onMounted(() => {
    toolListRequest.refresh()
})
</script>