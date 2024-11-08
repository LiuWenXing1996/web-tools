<template>
    <div class="w-full h-full flex justify-center items-center p-[30px]">
        <div class="w-[500px]">
            <el-divider>
                <el-text size="large">设置超管</el-text>
            </el-divider>
            <el-form ref="formRef" :model="formModel" label-width="auto" status-icon :rules="rules">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="formModel.name" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formModel.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formModel.password" type="password" placeholder="请输入密码" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="formModel.confirmPassword" type="password" placeholder="再次输入密码" show-password />
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" :loading="systemInitRequest.loading.value"
                        @click="systemInitRequest.refresh()">
                        初始化
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>

</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { Params } from "~/server/api/system/init.post"
import { validateUserName } from '~/utils';
const formRef = ref<FormInstance>()
const formModel = reactive({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
})
const rules = reactive<FormRules<typeof formModel>>({
    name: [
        { required: true, message: '请输入用户名', trigger: ["change", 'blur'] },
        {
            validator: (rule, value) => {
                return validateUserName(value)
            }, message: '用户名只能包含字母和数字和中文，且长度不能小于4', trigger: ["change", 'blur']
        }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: ["change", 'blur'] },
        { type: "email", message: '请输入格式正确的邮箱', trigger: ["change", 'blur'] }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: ["change", 'blur'] },
       
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: ["change", 'blur'] },
        {
            validator: (rule, value) => {
                return validatePassword(value)
            }, message: '密码只能包含字母和数字，且长度不能小于8', trigger: ["change", 'blur']
        },
        {
            validator: (rule, value) => {
                return value === formModel.password
            }, message: '两次密码不一致', trigger: ["change", 'blur']
        }
    ]
})
const systemInitRequest = useCustomRequest(async () => {
    if (!formRef.value) {
        return
    }
    const valid = await formRef.value.validate();
    if (!valid) {
        return
    }
    const params: Params = {
        super: {
            name: formModel.name,
            email: formModel.email,
            password: formModel.password,
        }
    }
    const res = await $fetch("/api/system/init", {
        method: "POST",
        body: params,
    })
    if (!res) {
        throw new Error("初始化失败")
    }
    return navigateTo("/", {
        replace: true
    })
})

definePageMeta({
    middleware: [defineNuxtRouteMiddleware(async (to, from) => {
        const systemInited = await $fetch("/api/system/is-inited")
        if (systemInited) {
            return navigateTo("/", {
                replace: true
            })
        }
    })]
})
</script>
