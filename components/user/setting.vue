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
            <div>
                <el-descriptions title="侧边工具栏" class="mt-[20px]">
                    <template #extra>
                        <el-button type="primary" @click="userSideBarListRef?.add">添加</el-button>
                    </template>
                </el-descriptions>
                <div>
                    <user-side-bar-list ref="userSideBarListRef" />
                </div>

            </div>
        </template>
        <template v-else>
            <el-empty description="用户未登录" />
        </template>
    </div>
</template>
<script setup lang="ts">
import type { UserSideBarList } from '#components';

const currentUser = useCurrentUser()


const userSideBarListRef = ref<InstanceType<typeof UserSideBarList> | null>(null)

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