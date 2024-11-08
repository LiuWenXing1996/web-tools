<template>
    <div class="h-full w-full">
        <template v-if="user.current.value">
            <el-collapse>
                <el-collapse-item title="工具管理">
                    <admin-tool-list />
                </el-collapse-item>
            </el-collapse>
        </template>
        <template v-else>
            <user-empty-un-login />
        </template>

    </div>
</template>
<script setup lang="ts">
const user = useCurrentUser()
</script>
<style lang="less" scoped>
.sss {
    color: var(--el-svg-monochrome-grey);
    font-size: 160px;
}
</style>
