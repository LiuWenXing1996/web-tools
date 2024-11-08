<template>
    <div class="h-full w-full">
        <template v-if="currentUser.current.value">
            <el-descriptions title="用户信息" border>
                <template #extra>
                    <el-button type="primary">编辑</el-button>
                </template>
                <el-descriptions-item label="名称">{{ currentUser.current.value.name }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ currentUser.current.value.email }}</el-descriptions-item>
                <el-descriptions-item label="是否管理员">
                    {{
                        currentUser.current.value.isAdmin ? "是" : "否"
                    }}
                </el-descriptions-item>
                <el-descriptions-item label="是否超管">
                    {{
                        currentUser.current.value.isSuper ? "是" : "否"
                    }}
                </el-descriptions-item>
            </el-descriptions>
            <!-- TODO：继续实现工具 -->
            <el-descriptions title="侧边工具栏" class="mt-[20px]">
                <el-descriptions-item label="名称">{{ currentUser.current.value.name }}</el-descriptions-item>

                <el-button>添加</el-button>
            </el-descriptions>
        </template>
        <template v-else>
            用户未登录
        </template>
    </div>
</template>
<script setup lang="ts">
const currentUser = useCurrentUser()
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