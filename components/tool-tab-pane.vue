<template>
    <!-- <n-tab-pane v-if="tool" :closable="true" :name="name" class="h-full w-full p-[20px] overflow-y-auto">
        <template #label>
            <div class="flex flex-row items-center justify-center">
                <component :is="tool.icon" />
                <div class=" ml-[3px]">
                    {{ tool.title }}
                </div>
            </div>

        </template>
<tool-pane :name="name" />
</n-tab-pane>
<n-tab-pane v-else :closable="true" :label="'未实现此面板'" :name="name">
    <tool-pane :name="name" />
</n-tab-pane> -->
    <n-tab-pane :name="name" display-directive="show">
        {{ name }}
    </n-tab-pane>
</template>
<script setup lang="ts">
const props = defineProps<{
    name: string
}>()
const tool = computed(() => {
    return findTool(props.name)
})
</script>