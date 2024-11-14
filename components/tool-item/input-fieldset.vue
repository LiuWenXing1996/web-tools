<template>
    <fieldset class="rounded-[8px] border p-[16px]">
        <legend class="-ml-[4px] px-[4px] text-[14px] font-medium">
            <slot name="label"></slot>
        </legend>
        <slot name="default"></slot>
    </fieldset>
</template>
<script setup lang="ts">
defineSlots<{
    label(): any
    default(): any
}>()
</script>