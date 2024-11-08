<template>
    <el-empty description="用户未登录" class="custom-el-empty">
        <template #image>
            <icon name="ri:lock-fill" class="un-login-icon"></icon>
        </template>
        <el-button type="primary" @click="loginDialogVisible = true">登录</el-button>
    </el-empty>
    <el-dialog v-model="loginDialogVisible" title="登录" width="500" destroy-on-close>
        <user-login-or-register />
    </el-dialog>
</template>
<script lang="ts" setup>
const loginDialogVisible = ref(false)
</script>
<style lang="less" scoped>
.custom-el-empty {
    :deep(> .el-empty__description) {
        margin-top: 0px;
    }
}

.un-login-icon {
    color: #e5e7eb;
    font-size: 160px;
}
</style>
