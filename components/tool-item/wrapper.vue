<template>
    <div class="size-full flex flex-col md:flex-row ">
        <div class="w-full h-[50%] mb-[5px]  md:w-[50%] md:h-full md:mr-[5px] md:mb-[0px]">
            <div class="relative h-full rounded-[12px] border">
                <div class="absolute top-0 bottom-0 left-0 right-0 py-[10px] pl-[10px] custom-n-scrollbar">
                    <n-scrollbar trigger="none">
                        <div class="pr-[10px]">
                            <slot name="input"></slot>
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
defineSlots<{
    input(): any
    output(): any
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