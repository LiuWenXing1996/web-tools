<template>
    <div class="h-screen w-screen">
        <div class="h-full flex flex-col">
            <div class="h-[50px] flex justify-between items-center border-b">
                <div class="flex h-full items-center">
                    <div :class="`w-[50px] h-full items-center justify-center flex border-r hover:text-primary`">
                        <normal-icon name="ri:tools-fill" @click="goToHome"
                            class="cursor-pointer border rounded-[6px]"></normal-icon>
                    </div>
                </div>
                <div class="pr-[10px]">
                    <div :class="`w-[50px] h-full items-center justify-center flex`">
                        <normal-icon v-if="theme.isDark.value" name="material-symbols:nightlight-badge-rounded"
                            @click="theme.toggle"
                            class="cursor-pointer  rounded-[6px] hover:bg-hoverColor"></normal-icon>
                        <normal-icon v-else name="material-symbols:light-mode-outline" @click="theme.toggle"
                            class="cursor-pointer  rounded-[6px] hover:bg-hoverColor"></normal-icon>

                    </div>
                </div>
            </div>
            <div class="h-[calc(100%-50px)] flex">
                <div class="h-full w-[50px] flex flex-col border-r py-[8px]">
                    <div v-for="tool in allTools"
                        :class="`w-[full] last:mb-0 mb-[4px] items-center justify-center flex`">
                        <n-tooltip trigger="hover" placement='right'>
                            <template #trigger>
                                <normal-icon :name="tool.meta?.icon || ''" :class="[
                                    'cursor-pointer rounded-[6px]',
                                    editTabs.currentTabName.value === tool.name ? 'bg-primaryActiveBg text-primary' : 'hover:bg-hoverColor'
                                ]" @click=" editTabs.addTab(tool.name)"></normal-icon>
                            </template>
                            {{ tool.meta?.title }}
                        </n-tooltip>
                    </div>
                </div>
                <div class="h-full w-[calc(100%-50px)]">
                    <template v-if="editTabs.currentTabName.value && editTabs.currentTabName.value.length > 0">
                        <n-tabs :value="editTabs.currentTabName.value" @update:value="(v) => {
                            editTabs.activeTab(v)
                        }" size="small" type="card" animated closable @close="(key) => {
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
                            <n-tab-pane :name="item.name" :tab="item.tool?.meta?.title || `工具 ${item.name} 未实现`"
                                v-for="item in toolTabs" display-directive="show">
                                <template v-if="item.tool">
                                    <component :is="item.tool.content"></component>
                                </template>
                                <template v-else>
                                    {{ `工具 ${item.name} 未实现` }}
                                </template>
                            </n-tab-pane>
                        </n-tabs>
                    </template>
                    <template v-else>
                        <div class="size-full flex items-center justify-center">
                            <n-empty description="没有打开的工具">
                            </n-empty>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { first } from 'radash';
const route = useRoute();
const toolName = computed(
    () => first(arraify(route.params.toolName)) || undefined
);
const theme = useTheme()
const editTabs = useEditTabs()
const allTools = getAllTools();
const toolTabs = computed(() => {
    return editTabs.openedTabNames.value.map(toolName => {
        return {
            name: toolName,
            tool: findTool(toolName),
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

watch(toolName, () => {
    if (toolName.value) {
        if (toolName.value !== editTabs.currentTabName.value) {
            editTabs.addTab(toolName.value)
        }
    }

}, {
    immediate: true
})
</script>