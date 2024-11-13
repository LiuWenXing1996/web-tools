<template>
    <div class="h-screen w-screen">
        <div class="h-full flex flex-col">
            <div class="h-[50px] flex justify-between items-center border-b">
                <div class="flex h-full items-center">
                    <a href="/" target="_blank"
                        :class="`w-[50px] h-full items-center justify-center flex border-r hover:text-primary`">
                        <normal-icon name="ri:tools-fill" class="cursor-pointer border rounded-[6px]"></normal-icon>
                    </a>
                </div>
                <div class="pr-[10px] flex">
                    <div :class="`h-full items-center justify-center flex`">
                        <normal-icon v-if="theme.isDark.value" name="material-symbols:nightlight-badge-rounded"
                            @click="theme.toggle"
                            class="cursor-pointer  rounded-[6px] hover:bg-hoverColor"></normal-icon>
                        <normal-icon v-else name="material-symbols:light-mode-outline" @click="theme.toggle"
                            class="cursor-pointer  rounded-[6px] hover:bg-hoverColor"></normal-icon>

                    </div>
                    <a href="https://github.com/LiuWenXing1996/web-tools" target="_blank"
                        :class="`h-full items-center justify-center flex pl-[2px]`">
                        <normal-icon name="mdi:github"
                            class="cursor-pointer  rounded-[6px] hover:bg-hoverColor"></normal-icon>
                    </a>
                </div>
            </div>
            <div class="h-[calc(100%-50px)] flex">
                <div class="h-full w-[50px] flex flex-col border-r py-[8px]">
                    <div v-for="opt in sideBarOptions"
                        :class="`w-[full] last:mb-0 mb-[4px] items-center justify-center flex`">
                        <n-popselect v-model:value="editTabs.currentTabName.value" :options="opt.list" size="medium"
                            scrollable placement='right-start' @update:value="(v) => {
                                editTabs.addTab(v)
                            }">
                            <template #header>
                                {{ opt.title }}
                            </template>
                            <normal-icon :name="opt.icon || ''" :class="[
                                'cursor-pointer rounded-[6px]',
                                opt.list.find(e => e.value === editTabs.currentTabName.value) ? 'bg-primaryActiveBg text-primary' : 'hover:bg-hoverColor'
                            ]"></normal-icon>
                        </n-popselect>
                    </div>
                </div>
                <div class="h-full w-[calc(100%-50px)]">
                    <template v-if="editTabs.currentTabName.value && editTabs.currentTabName.value.length > 0">
                        <n-tabs class="h-full" :value="editTabs.currentTabName.value" @update:value="(v) => {
                            editTabs.activeTab(v)
                        }" size="small" type="card" closable @close="(key) => {
                            editTabs.removeTab(key);
                        }" pane-class="size-full !p-[10px]">
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
import type { SelectOption } from 'naive-ui';
import { first } from 'radash';
const route = useRoute();
const toolName = computed(
    () => first(arraify(route.params.toolName)) || undefined
);
const ss = ref('Drive My Car')
const theme = useTheme()
const editTabs = useEditTabs()
const allTools = getAllTools();
const sideBarOptions = Object.entries(ToolCategoryMap).map(([name, meta]) => {
    const list: SelectOption[] = allTools.filter(tool => tool.meta?.category === name).map(tool => {
        return {
            label: tool.meta?.title || tool.name,
            value: tool.name
        }
    })
    return {
        name,
        ...meta,
        list
    }
})
const toolTabs = computed(() => {
    return editTabs.openedTabNames.value.map(toolName => {
        return {
            name: toolName,
            tool: findTool(toolName),
        }
    })
})

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