<template>
    <div class="h-full w-full">
        <el-form ref="formRef" v-loading="detailRequest.loading.value" :model="formModel" label-width="auto" status-icon
            :rules="rules">
            <el-form-item label="名称" prop="name">
                <el-input v-model="formModel.name" placeholder="请输入名称" disabled />
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
                <el-button type="primary" :loading="editRequest.loading.value" @click="() => { editRequest.run() }">
                    编辑
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import type { ToolContentName } from '#imports';
import type { FormInstance, FormRules } from 'element-plus';
import type { Params } from '~/server/api/tool/add.post';

const props = defineProps<{
    name: ToolContentName,
    hideOperate?: boolean
}>()
const emits = defineEmits<{
    (e: 'successEdit'): void
}>()

const formRef = ref<FormInstance>()
const formModel = ref({
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
const editRequest = useCustomRequest(async () => {
    if (!formRef.value) {
        return
    }
    const valid = await formRef.value.validate();
    if (!valid) {
        return
    }
    const params: Params = {
        name: formModel.value.name,
        title: formModel.value.title,
        icon: formModel.value.icon,
        description: formModel.value.description,
    }
    const res = await $fetch("/api/tool/edit", {
        method: "POST",
        body: params
    })

    if (!res) {
        throw new Error("编辑失败")
    }
    emits("successEdit")
})
const detailRequest = useCustomRequest(async () => {
    const res = await $fetch("/api/tool/detail", {
        params: {
            name: props.name
        }
    })
    if (!res) {
        throw new Error("获取详情失败")
    }
    formModel.value = {
        name: res.name,
        title: res.title,
        icon: res.icon || "",
        description: res.description || "",
    }
    return res
})
defineExpose({
    editRequest
})
onMounted(() => {
    detailRequest.run()
})
</script>
