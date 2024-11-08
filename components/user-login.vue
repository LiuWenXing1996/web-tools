<template>
  <div>
    <el-form ref="formRef" :model="formModel" label-width="auto" status-icon :rules="rules">
      <el-form-item label="登录方式" prop="mode">
        <el-radio-group v-model="formModel.mode">
          <el-tooltip effect="dark" content="用户名" placement="top">
            <el-radio-button value="name">
              <icon name="ep:user"></icon>
            </el-radio-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="邮箱" placement="top">
            <el-radio-button value="email">
              <icon name="ic:outline-email"></icon>
            </el-radio-button>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户名" prop="name" v-if="formModel.mode === 'name'">
        <el-input v-model="formModel.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" v-if="formModel.mode === 'email'">
        <el-input v-model="formModel.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formModel.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item label=" ">
        <div class=" flex flex-col	">
          <div>
            <el-button type="primary" :loading="loginRequest.loading.value" @click="loginRequest.refreshAsync()">
              登录
            </el-button>
          </div>
          <div>
            <el-button size="small" @click="emits('toggleRegister')" link type="primary">
              没有账号? 注册账号
            </el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
const emits = defineEmits<{
  (e: 'toggleRegister'): void
}>()
const routeHelper = useRouteHelper();
const formRef = ref<FormInstance>()
const formModel = reactive({
  mode: "name",
  name: "",
  password: "",
  email: "",
})

const loginRequest = useCustomRequest(async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) {
    return
  }
  const mode = formModel.mode;
  let res = false
  if (mode === "name") {
    res = await $fetch("/api/user/login-with-name", {
      method: "POST",
      body: {
        name: formModel.name,
        password: formModel.password,
      },
    });
  }
  if (mode === "email") {
    res = await $fetch("/api/user/login-with-email", {
      method: "POST",
      body: {
        email: formModel.email,
        password: formModel.password,
      },
    });
  }
  if (!res) {
    throw new Error("登录失败")
  }
  await routeHelper.reload()
})

const rules = reactive<FormRules<typeof formModel>>({
  name: [
    { required: true, message: '请输入用户名', trigger: ["change", 'blur'] },

  ],
  password: [
    { required: true, message: '请输入密码', trigger: ["change", 'blur'] },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: ["change", 'blur'] },
    { type: "email", message: '请输入格式正确的邮箱', trigger: ["change", 'blur'] }
  ],
})
</script>
