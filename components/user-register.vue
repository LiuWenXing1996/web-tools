<template>
  <div>
    <el-form ref="formRef" :model="formModel" label-width="auto" status-icon :rules="rules">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入你的用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formModel.email" placeholder="请输入你的邮箱" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="formModel.code" placeholder="请输入收到的验证码" />
        <el-button type="primary" @click="sendCode" class="mt-[10px]">
          获取验证码
        </el-button>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formModel.password" type="password" placeholder="请输入你的密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="formModel.confirmPassword" type="password" placeholder="再次输入你的密码" show-password />
      </el-form-item>
      <el-form-item label=" ">
        <div class=" flex flex-col	">
          <div>
            <el-button type="primary" @click="submitForm(formRef)">
              注册
            </el-button>
          </div>
          <div>
            <el-button size="small" @click="emits('toggleLogin')" link type="primary">
              已有账号? 立即登录
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
  (e: 'toggleLogin'): void
}>()

const formRef = ref<FormInstance>()
const formModel = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  code: "",
})
const sendRegisterCodeRequest = useCustomRequest(async () => {
  const validEmail = await formRef.value?.validateField("email")
  if (!validEmail) {
    return
  }
  const res = await $fetch("/api/email/send-register-code", {
    method: "POST",
    body: {
      email: formModel.email,
    },
  });
  return res
})

const rules = reactive<FormRules<typeof formModel>>({
  name: [
    { required: true, message: '请输入用户名', trigger: ["change", 'blur'] },
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: ["change", 'blur'] },
    {
      validator: (rule, value) => {
        return validatePassword(value)
      }, message: '密码只能包含字母和数字，且长度不能小于8', trigger: ["change", 'blur']
    }
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
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: ["change", 'blur'] },
    { type: "email", message: '请输入格式正确的邮箱', trigger: ["change", 'blur'] }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: ["change", 'blur'] }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  const valid = await formEl.validate();
  if (!valid) {
    return
  }
  // const register = async (params: {
  //   name: string;
  //   email: string;
  //   password: string;
  // }) => {
  //   return await $fetch("/api/user/register", {
  //     method: "post",
  //     body: {
  //       name: params.name,
  //       email: params.email,
  //       password: params.password,
  //     },
  //   });
  // };
}

const sendCode = async () => {
  sendRegisterCodeRequest.refresh()
}

</script>
