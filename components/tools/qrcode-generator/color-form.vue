<template>
    <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
        <n-form-item path="type" first label="颜色类型">
            <n-radio-group v-model:value="model.type">
                <n-space>
                    <n-radio value="single"> 单色 </n-radio>
                    <n-radio value="gradient"> 渐变 </n-radio>
                </n-space>
            </n-radio-group>
        </n-form-item>
        <n-form-item path="value.single" first label="颜色" v-if="model.type === 'single'">
            <n-color-picker v-model:value="model.value.single" :render-label="() => ''" />
        </n-form-item>
        <template v-if="model.type === 'gradient'">
            <tools-qrcode-generator-gradient-form ref="colorGradient" />
        </template>
    </n-form>
</template>
<script lang="ts">
export type Model = {
    type: "single" | "gradient",
    value: {
        single: string,
        gradient: GradientFormModel | undefined
    }
}
</script>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import type { Model as GradientFormModel } from "./gradient-form.vue"

const colorGradientRef = useTemplateRef('colorGradient');
const formRef = ref<FormInst | null>(null)

const model = reactive<Model>({
    type: "single",
    value: {
        single: "#000",
        gradient: undefined
    }
})
const rules: FormRules = {}

watch(() => colorGradientRef.value?.model, (val) => {
    model.value.gradient = val
})

defineExpose({
    formRef,
    colorGradientRef,
    model
})
</script>
