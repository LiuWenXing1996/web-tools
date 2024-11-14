<template>
    <div class="size-full flex flex-col md:flex-row ">
        <div class="w-full h-[50%] mb-[5px]  md:w-[50%] md:h-full md:mr-[5px] md:mb-[0px]">
            <div class="relative h-full rounded-[12px] border">
                <div class="absolute top-0 bottom-0 left-0 right-0 py-[10px] pl-[10px] custom-n-scrollbar">
                    <n-scrollbar trigger="none">
                        <div class="pr-[10px]">
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
                    </n-scrollbar>
                </div>
            </div>
        </div>
        <div class="w-full h-[50%] mt-[5px] md:w-[50%] md:h-full md:ml-[5px] md:mt-[0px]">
            <div class="relative h-full rounded-[12px] border bg-secondary">
                <div class="absolute top-0 bottom-0 left-0 right-0 py-[10px] pl-[10px] custom-n-scrollbar">
                    <n-scrollbar trigger="none">
                        <div class="pr-[10px]">
                            <slot name="output"></slot>
                        </div>
                    </n-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { isString } from 'radash';

defineSlots<{
    input(): any
    output(): any
}>()
const editTabs = useEditTabs()
const toolRenderInjectHelper = useToolRenderInjectHelper();
const name = toolRenderInjectHelper.inject()
const tool = computed(() => {
    return findTool(name?.value || "")
});

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
                    title: tool.meta?.title || tool.name,
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
</script>
<style lang="less" scoped>
.custom-n-scrollbar {
    :deep(> .n-scrollbar) {
        >.n-scrollbar-rail {
            right: 2px;
        }
    }

}
</style>