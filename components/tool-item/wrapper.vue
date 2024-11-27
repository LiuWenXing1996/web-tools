<template>
    <div :class="[
        'size-full flex flex-col ',
        vertical ? '' : 'md:flex-row'
    ]">
        <div :class="[
            'w-full h-[50%] mb-[5px] rounded-[12px] border p-[10px]  ',
            vertical ? 'h-[20%]' : 'md:w-[50%] md:h-full md:mr-[5px] md:mb-[0px]'
        ]">
            <custom-scrollbar out-bar>
                <div class="relative">
                    <tool-item-input-fieldset>
                        <template #label>操作</template>
                        <n-space>
                            <n-button size="small" :loading="collectToolRequest.loading.value"
                                @click="collectToolRequest.runAsync" v-if="!isCollected">收藏</n-button>
                            <n-button size="small" :loading="unCollectToolRequest.loading.value"
                                @click="unCollectToolRequest.runAsync" v-if="isCollected">取消收藏</n-button>
                        </n-space>
                    </tool-item-input-fieldset>
                    <tool-item-input-fieldset v-if="tool?.meta?.description" class=" mb-[10px]">
                        <template #label>描述</template>
                        <div class=" whitespace-pre-wrap">
                            {{ tool?.meta?.description }}
                        </div>
                    </tool-item-input-fieldset>
                    <slot name="input"></slot>
                    <tool-item-input-fieldset v-if="toolRelated.length > 0">
                        <template #label>相关工具</template>
                        <n-space>
                            <n-tag size="small" v-for="item in toolRelated" class=" cursor-pointer hover:text-primary"
                                @click="() => handleToolRelatedItemClick(item)">
                                {{
                                    item.title
                                }}
                            </n-tag>
                        </n-space>
                    </tool-item-input-fieldset>
                </div>
            </custom-scrollbar>
        </div>
        <div :class="[
            'w-full h-[50%] mt-[5px]  rounded-[12px] border ',
            vertical ? 'h-[80%]' : 'md:w-[50%] md:h-full md:ml-[5px] md:mt-[0px]'
        ]">
            <div class="size-full flex flex-col p-[10px]">
                <div class="grow">
                    <tool-item-input-fieldset class="size-full">
                        <template #label>{{ outputLabel ? outputLabel : '结果' }}</template>
                        <div class="size-full relative">
                            <custom-scrollbar out-bar>
                                <div class="min-h-full">
                                    <slot name="output"></slot>
                                </div>
                            </custom-scrollbar>
                        </div>
                    </tool-item-input-fieldset>
                </div>
                <div class="mt-[10px]" v-if="slots.actions">
                    <tool-item-input-fieldset>
                        <template #label>操作</template>
                        <slot name="actions"></slot>
                    </tool-item-input-fieldset>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { isString } from 'radash';
const props = defineProps<{
    vertical?: boolean,
    outputLabel?: string
}>()
const slots = defineSlots<{
    input(): any
    output(): any
    actions?: () => any
}>()
const editTabs = useEditTabs()
const toolRenderInjectHelper = useToolRenderInjectHelper();
const name = toolRenderInjectHelper.inject()
const tool = computed(() => {
    return findTool(name?.value || "")
});
const user = useCurrentUser();

enum ToolRelatedType {
    tool = "tool",
    external = "external"
}

type ToolRelatedItem = {
    type: ToolRelatedType;
    title: string;
    target: string;
}

const toolRelated: ComputedRef<ToolRelatedItem[]> = computed(() => {
    const related = tool.value?.meta?.related || []
    const res = filterNullable(related.map(r => {
        if (isString(r)) {
            const tool = findTool(r)
            if (tool) {
                return {
                    type: ToolRelatedType.tool,
                    title: `本站 - ${tool.meta?.title || tool.name}`,
                    target: tool.name
                }
            }
        } else {
            return {
                type: ToolRelatedType.external,
                title: r.title,
                target: r.url
            }
        }
    }))
    return res
})
const handleToolRelatedItemClick = async (item: ToolRelatedItem) => {
    if (item.type === ToolRelatedType.tool) {
        editTabs.addTab(item.target)
    }
    if (item.type === ToolRelatedType.external) {
        await navigateTo(item.target, {
            external: true,
            open: {
                target: '_blank'
            }
        })
    }
}

const isCollected = computed(() => {
    const toolName = name?.value;
    if (!toolName) {
        return false
    }
    return user.setting.value?.sideBar?.tools?.[toolName]
})

const unCollectToolRequest = useCustomRequest(async () => {
    const userName = user.current.value?.name;
    if (!userName) {
        return
    }
    const toolName = name?.value;
    if (!toolName) {
        return
    }
    await $fetch("/api/user/setting/update", {
        method: "POST",
        body: {
            name: userName,
            config: {
                sideBar: {
                    tools: {
                        [toolName]: false
                    }
                },
            },
        },
    });
    await user.settingDetailRequest.refreshAsync()
})

const collectToolRequest = useCustomRequest(async () => {
    const userName = user.current.value?.name;
    if (!userName) {
        return
    }
    const toolName = name?.value;
    if (!toolName) {
        return
    }
    await $fetch("/api/user/setting/update", {
        method: "POST",
        body: {
            name: userName,
            config: {
                sideBar: {
                    tools: {
                        [toolName]: true
                    }
                },
            },
        },
    });
    await user.settingDetailRequest.refreshAsync()
})
</script>