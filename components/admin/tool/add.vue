<template>
    <div class="h-full w-full">
        <el-form ref="formRef" :model="formModel" label-width="auto" status-icon :rules="rules">
            <el-form-item label="名称" prop="name">
                <el-input v-model="formModel.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="formModel.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="formModel.icon" placeholder="请输入图标" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="formModel.description" :rows="2" type="textarea" placeholder="请输入描述" />
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
import type { Params } from '~/server/api/tool/add.post';

defineProps<{
    hideOperate?: boolean
}>()
const emits = defineEmits<{
    (e: 'successAdd'): void
}>()

const formRef = ref<FormInstance>()
const formModel = reactive({
    name: "",
    title: "",
    icon: "",
    description: "",
})
const rules = reactive<FormRules<typeof formModel>>({
    name: [
        { required: true, message: '请输入名称', trigger: ["change", 'blur'] },
    ],
    title: [
        { required: true, message: '请输入标题', trigger: ["change", 'blur'] },
    ]
})
const addRequest = useCustomRequest(async () => {
    if (!formRef.value) {
        return
    }
    const valid = await formRef.value.validate();
    if (!valid) {
        return
    }
    const params: Params = {
        name: formModel.name,
        title: formModel.title,
        icon: formModel.icon,
        description: formModel.description,
    }
    const res = await $fetch("/api/tool/add", {
        method: "POST",
        body: params
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
