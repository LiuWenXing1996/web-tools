<template>
    <div class="size-full flex">
        <div class="w-[50%] mr-[5px]">
            <fieldset class="rounded-[8px] border p-[16px]">
                <legend class="-ml-[4px] px-[4px] text-[14px] font-medium">
                    颜色
                </legend>
                <n-form ref="formRef" :model="model" :rules="rules">
                    <n-form-item label="输入" path="color" first>
                        <n-input clearable placeholder="输入合法色值" v-model:value="model.color" />
                    </n-form-item>
                </n-form>
            </fieldset>
        </div>
        <div class="w-[50%] ml-[5px]">
            <div class="relative flex h-full flex-col rounded-[12px] bg-secondary p-[16px]">
                <template v-if="finalColor">
                    <div class="h-[30px] w-[30px]" :style="{
                        backgroundColor: finalColor
                    }"></div>
                </template>
                <template v-else>
                    <n-empty description="无效色值" />
                </template>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

defineOptions({
    toolMeta: defineToolMeta({
        title: 'css 颜色预览',
        description: "sssssss",
        icon: "ci:color"
    })
})

const initialColor = 'red'

const model = reactive({
    color: initialColor
})
const formRef = ref<FormInst | null>(null)
const finalColor = computedAsync(
    async () => {
        const color = model.color;
        try {
            await formRef.value?.validate() || {}
        } catch (error) {
            return
        }
        return color
    },
    initialColor,
)
const rules: FormRules = {
    color: [
        {
            required: true,
            message: '请输入色值',
            trigger: ['input', 'change', 'blur', 'focus']
        },
        {
            validator: (_rule, value: string) => {
                let otpNode = new Option();
                otpNode.style.color = value
                return !!otpNode.style.color
            },
            message: '请输入合法色值',
            trigger: ['input', 'change', 'blur', 'focus']
        }
    ]
}
</script>