<template>
    <div class="h-full w-full">
        <div v-if="!hideTopOperations">
            <el-button @click="user.settingDetailRequest.run"
                :disabled="user.settingDetailRequest.loading.value">刷新</el-button>
            <el-button @click="add" :disabled="user.settingDetailRequest.loading.value">添加</el-button>
        </div>
        <el-table v-loading="user.settingDetailRequest.loading.value" :data="list">
            <el-table-column fixed prop="name" label="名称" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="icon" label="图标">
                <template #default="scope">
                    <component :is="scope.row.icon" />
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="user.hasFixed" label="是否固定" />
            <el-table-column fixed="right" label="操作" min-width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="() => {
                        currentEditToolName = scope.row.name;
                        editDialogVisible = true
                    }">
                        移除
                    </el-button>
                    <el-button link type="primary" size="small" @click="() => {
                        currentEditToolName = scope.row.name;
                        editDialogVisible = true
                    }">
                        上移
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="addDialogVisible" title="添加工具" destroy-on-close>
            <user-side-bar-add :hide-operate="true" ref="addComponentRef" @success-add="() => {
                addDialogVisible = false;
            }" />
            <template #footer>
                <div>
                    <el-button @click="() => {
                        addDialogVisible = false
                    }">取消</el-button>
                    <el-button type="primary" :loading="addComponentRef?.addRequest.loading.value" @click="() => {
                        addComponentRef?.addRequest.run()
                    }">
                        添加
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import type { ToolContentName } from '#imports';
import { AdminToolDel, AdminToolAdd, AdminToolEdit } from "#components"

const props = defineProps<{
    hideTopOperations?: boolean
}>()
const user = useCurrentUser()

const list = computed(() => {
    const sideBarTools = user.setting.value?.sideBar?.tools || [];
    const res = filterNullable(sideBarTools.map(e => {
        return findTool(e)
    }))
    return res
})


const addDialogVisible = ref(false)
const addComponentRef = ref<InstanceType<typeof AdminToolAdd> | null>(null)
const add = () => {
    addDialogVisible.value = true
}

const editDialogVisible = ref(false)
const editComponentRef = ref<InstanceType<typeof AdminToolEdit> | null>(null)
const currentEditToolName = ref<ToolContentName | undefined>()

const delDialogVisible = ref(false)
const delComponentRef = ref<InstanceType<typeof AdminToolDel> | null>(null)
const currentDelToolName = ref<ToolContentName | undefined>()

defineExpose({
    add
})

</script>
