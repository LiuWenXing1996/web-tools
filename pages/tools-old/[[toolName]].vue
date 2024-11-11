<template>
    <div class="h-screen w-screen">
        <div class="h-full flex flex-col">
            <div class="h-[50px] flex justify-between items-center border-b">
                <div class="flex h-full items-center">
                    <div class="w-[64px] h-full items-center justify-center flex border-r">
                        <icon size="33" name="custom:logo" class="cursor-pointer" @click="goToHome" />
                    </div>
                </div>
                <div class="pr-[10px]">
                    <user-avatar />
                </div>
            </div>
            <div class="h-[calc(100%-50px)] flex">
                <div class="flex flex-col h-full w-[64px] items-center border-r py-[10px]">
                    <!-- TODO:继续实现工具列表 -->
                    <div v-for="t in user.setting.value?.sideBar?.tools"
                        class="flex items-center justify-center w-full h-[44px] text-[30px] cursor-pointer hover:text-primary">
                        <tool-icon :name="t" />
                    </div>
                </div>
                <div class="flex w-[calc(100%-64px)]">
                    <el-tabs v-model="editTabs.currentTabName.value" type="card" class="w-full custom-el-tabs"
                        @tab-remove="(k: any) => editTabs.removeTab(k)">
                        <tool-tab-pane v-for="item in editTabs.openedTabNames.value" :key="item" :name="item" />
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { first } from 'radash';
const route = useRoute();
const user = useCurrentUser();
const toolName = computed(
    () => first(arraify(route.params.toolName)) || undefined
);

const editTabs = useEditTabs()
const goToHome = async () => {
    return await navigateTo("/", {
        external: true,
        open: {
            target: "_blank"
        }
    })
}
</script>
<style lang="less" scoped>
.custom-el-tabs {
    :deep(> .el-tabs__header) {
        margin-bottom: 0px;
    }
}
</style>