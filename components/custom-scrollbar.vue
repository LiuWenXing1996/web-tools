<template>
    <div class="relative size-full">
        <div class="absolute top-0 bottom-0 left-0 right-0 py-[10px] pl-[10px] custom-n-scrollbar">
            <n-scrollbar trigger="none" x-scrollable>
                <slot name="default"></slot>
            </n-scrollbar>
        </div>
    </div>
</template>
<script setup lang="ts">
defineSlots<{
    default(): any
}>()
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