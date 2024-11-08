<template>
    <div class="h-full w-full">
        <el-form ref="formRef" :model="formModel" label-width="auto" status-icon :rules="rules">
            <el-form-item label="工具" prop="list">
                <el-checkbox-group v-model="formModel.list">
                    <el-checkbox v-for="tool in allTools" :label="tool.title" :value="tool.name" />
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label=" " v-if="!hideOperate">
                <el-button type="primary" :loading="addRequest.loading.value" @click="() => { addRequest.run() }">
                    添加
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

defineProps<{
    hideOperate?: boolean
}>()
const emits = defineEmits<{
    (e: 'successAdd'): void
}>()

const user = useCurrentUser();
const allTools = getAllTools();
const formRef = ref<FormInstance>()
const formModel = reactive<{ list: string[] }>({
    list: []
})
const rules = reactive<FormRules<typeof formModel>>({
    list: [
        { required: true, message: '请选择至少一个工具', trigger: ["change", 'blur'] },
    ],
})
const addRequest = useCustomRequest(async () => {
    if (!formRef.value) {
        return
    }
    const valid = await formRef.value.validate();
    if (!valid) {
        return
    }

    const newTools: string[] = [...formModel.list, ...(user.setting.value?.sideBar?.tools || [])]
    const res = await user.settingUpdateRequest.runAsync({
        sideBar: {
            tools: newTools
        }
    })

    if (!res) {
        throw new Error("添加失败")
    }
    emits("successAdd")
})
defineExpose({
    addRequest
})
</script>
