<template>
    <tool-item-wrapper vertical output-label="设置">
        <template #output>
            <n-form ref="formRef" label-placement="left" label-width="70px" label-align="right" :model="model"
                :rules="rules">
                <n-form-item label="邮箱" path="name" first>
                    <n-input v-model:value="model.name" placeholder="请输入用户名" />
                </n-form-item>
            </n-form>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="handleSave">保存</n-button>
            </n-space>
        </template>
    </tool-item-wrapper>
</template>
<script setup lang="ts">
import type { FormRules } from 'naive-ui';
defineOptions({
    toolMeta: defineToolMeta({
        title: '超管后台',
        description: "超管后台",
        category: ToolCategory.admin
    })
})
const form = useTemplateRef("formRef")
const model = reactive({
    mode: "name",
    name: "",
    password: "",
    email: "",
})
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入用户名', trigger: ["change", 'blur'] },
        {
            validator: (rule, value) => {
                return validateUserName(value)
            }, message: '用户名只能包含字母和数字和中文，且长度不能小于4', trigger: ["change", 'blur']
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: ["change", 'blur'] },
        {
            validator: (rule, value) => {
                return validatePassword(value)
            }, message: '密码只能包含字母和数字，且长度不能小于8', trigger: ["change", 'blur']
        },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: ["change", 'blur'] },
        { type: "email", message: '请输入格式正确的邮箱', trigger: ["change", 'blur'] }
    ],
})
const handleSave = () => { }
</script>