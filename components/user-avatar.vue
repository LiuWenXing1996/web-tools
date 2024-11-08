<template>
  <div>
    <el-dropdown trigger="click">
      <icon size="22" name="ep:user" class="hover:text-primary" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="currentUser.current.value" @click="logoutDialogVisible = true">退出登录</el-dropdown-item>
          <el-dropdown-item v-else @click="loginDialogVisible = true">登录</el-dropdown-item>
          <el-dropdown-item @click="editTabs.addTab(ToolName['super-manager'])">超管后台</el-dropdown-item>
          <el-dropdown-item @click="editTabs.addTab(ToolName['admin-manager'])">管理员后台</el-dropdown-item>
          <el-dropdown-item @click="editTabs.addTab(ToolName['user-setting'])">用户设置</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dialog v-model="logoutDialogVisible" title="退出登录" width="500" destroy-on-close>
      <span>确定退出登录吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="logoutDialogVisible = false">不确定</el-button>
          <el-button type="primary" :loading="logoutRequest.loading.value" @click="logoutRequest.refreshAsync()">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="loginDialogVisible" title="登录" width="500" destroy-on-close>
      <user-login v-if="isLogin" @toggle-register="isLogin = false" />
      <user-register v-else @toggle-login="isLogin = true" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
const currentUser = useCurrentUser();
const logoutDialogVisible = ref(false)
const loginDialogVisible = ref(false)
const isLogin = ref(true)
const routeHelper = useRouteHelper();
const logoutRequest = useCustomRequest(async () => {
  const res = await $fetch("/api/user/logout");
  if (!res) {
    throw new Error("退出登录失败")
  }
  await routeHelper.reload()
});
const editTabs = useEditTabs() 
</script>
