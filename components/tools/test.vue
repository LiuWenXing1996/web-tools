<template>
    <div>test-tool</div>
</template>
<script setup lang="ts">
import { SvgIcon } from '#components';


defineOptions({
    toolMeta: defineToolMeta({
        title: 'sss',
        description: "sssssss",
        icon: () => h(SvgIcon, {
            name: "ri:admin-line",
        })
    })
})
</script>
<style lang="less" scoped></style>