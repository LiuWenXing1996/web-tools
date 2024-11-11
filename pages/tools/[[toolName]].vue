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
            <n-layout has-sider class="h-full">
                <n-layout-sider bordered :width="64">
                    <n-menu :collapsed="true" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
                        @update:value="(v) => {
                            editTabs.addTab(v)
                        }" />
                </n-layout-sider>
                <div class="h-full w-[calc(100%-64px)]">
                    <n-tabs :value="editTabs.currentTabName.value" @update:value="(v) => {
                        editTabs.activeTab(v)
                    }" type="card" animated closable @close="(key) => {
                        editTabs.removeTab(key);
                    }" :style="{
                        height: '100%',
                        display: 'flex',
                        flexDirection: ' column',
                    }" :pane-style="{
                        flexGrow: 1,
                        padding: '20px',
                        overflow: 'auto',
                    }">
                        <n-tab-pane :name="item.name" :tab="item.tool?.title || `工具 ${item.name} 未实现`" v-for="item in toolTabs"
                            display-directive="show">
                            <template v-if="item.tool">
                                <component :is="item.tool.content"></component>
                            </template>
                            <template v-else>
                                {{ `工具 ${item.name} 未实现` }}
                            </template>
                        </n-tab-pane>
                    </n-tabs>
                </div>
            </n-layout>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { MenuOption } from 'naive-ui';
import { first } from 'radash';
const route = useRoute();
const user = useCurrentUser();
const toolName = computed(
    () => first(arraify(route.params.toolName)) || undefined
);
// TODO:继续讲 element 转换到 naive ui 

const editTabs = useEditTabs()
const toolTabs = computed(() => {
    return editTabs.openedTabNames.value.map(toolName => {
        return {
            name: toolName,
            tool: findTool(toolName),
        }
    })
})
const menuOptions: ComputedRef<MenuOption[]> = computed(() => {
    const tools = filterNullable((user.setting.value?.sideBar?.tools || []).map(e => findTool(e)));
    return tools.map(tool => {
        return {
            label: tool.title,
            key: tool.name,
            icon: tool.icon
        }
    })
})
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