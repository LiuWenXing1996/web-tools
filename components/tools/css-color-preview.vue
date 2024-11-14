<template>
    <tool-item-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules">
                <tool-item-input-fieldset>
                    <template #label>
                        颜色
                    </template>
                    <n-form-item label="输入" path="color" first>
                        <n-input clearable placeholder="输入合法色值" v-model:value="model.color" />
                    </n-form-item>
                </tool-item-input-fieldset>
            </n-form>
        </template>
        <template #output>
            <template v-if="finalColor">
                <div class="h-[30px] w-[30px]" :style="{
                    backgroundColor: finalColor
                }"></div>
            </template>
            <template v-else>
                <n-empty description="无效色值" />
            </template>
        </template>
    </tool-item-wrapper>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

defineOptions({
    toolMeta: defineToolMeta({
        title: 'css 颜色预览',
        description: "css 颜色预览",
        category: ToolCategory.dev
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