<template>
    <div class="h-full w-full">
        <div>
            <el-button @click="listRequest.refresh" :disabled="listRequest.loading.value">刷新</el-button>
            <el-button @click="addDialogVisible = true">添加</el-button>
        </div>
        <el-table v-loading="listRequest.loading.value" :data="listRequest.data.value">
            <el-table-column fixed prop="name" label="名称" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="icon" label="图标" />
            <el-table-column prop="description" label="描述" />
            <el-table-column fixed="right" label="操作" min-width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="() => {
                        currentEditToolName = scope.row.name;
                        editDialogVisible = true
                    }">
                        编辑
                    </el-button>
                    <el-button link type="primary" size="small" @click="() => {
                        currentDelToolName = scope.row.name;
                        delDialogVisible = true
                    }">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="addDialogVisible" title="添加工具" destroy-on-close>
            <admin-tool-add :hide-operate="true" ref="addComponentRef" @success-add="() => {
                addDialogVisible = false;
                pageIndex = 1;
                listRequest.run()
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
        <el-dialog v-model="editDialogVisible" title="编辑工具" destroy-on-close>
            <admin-tool-edit :hide-operate="true" v-if="currentEditToolName" :name="currentEditToolName" @success-edit="() => {
                editDialogVisible = false;
                listRequest.run()
            }" ref="editComponentRef" />
            <template #footer>
                <div>
                    <el-button @click="() => {
                        currentEditToolName = undefined;
                        editDialogVisible = false
                    }">取消</el-button>
                    <el-button type="primary" :loading="editComponentRef?.editRequest.loading.value" @click="() => {
                        editComponentRef?.editRequest.run()
                    }">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="delDialogVisible" title="删除工具" destroy-on-close>
            <admin-tool-del v-if="currentDelToolName" :name="currentDelToolName" ref="delComponentRef" @success-del="() => {
                delDialogVisible = false;
                listRequest.run()
            }" />
            <template #footer>
                <div>
                    <el-button @click="() => {
                        currentDelToolName = undefined;
                        delDialogVisible = false
                    }">取消</el-button>
                    <el-button type="primary" :loading="delComponentRef?.delRequest.loading.value" @click="() => {
                        delComponentRef?.delRequest.run()
                    }">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import type { ToolContentName } from '#imports';
import { AdminToolDel, AdminToolAdd, AdminToolEdit } from "#components"

const pageSize = ref(10)
const pageIndex = ref(1)
const listRequest = useCustomRequest(async () => {
    const res = await $fetch("/api/tool/list", {
        params: {
            pageIndex: pageIndex.value,
            pageSize: pageSize.value
        }
    })
    return res
})
const addDialogVisible = ref(false)
const addComponentRef = ref<InstanceType<typeof AdminToolAdd> | null>(null)

const editDialogVisible = ref(false)
const editComponentRef = ref<InstanceType<typeof AdminToolEdit> | null>(null)
const currentEditToolName = ref<ToolContentName | undefined>()

const delDialogVisible = ref(false)
const delComponentRef = ref<InstanceType<typeof AdminToolDel> | null>(null)
const currentDelToolName = ref<ToolContentName | undefined>()

onMounted(() => {
    listRequest.refresh()
})
</script>
