<template>
    <fieldset :class="[
        'rounded-[8px] border-dashed border-2	 p-[10px] mt-[10px] first:mt-[0px]',
        // theme.isDark.value ? 'bg-bgDark' : 'bg-bgLight'
    ]">
        <legend :class="[
            '-ml-[4px] px-[5px] text-[14px] font-medium ',
            // theme.isDark.value ? 'bg-bgDark' : 'bg-bgLight'
        ]">
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
const theme = useTheme()
</script>