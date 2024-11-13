<template>
    <div class="size-full flex">
        <div class="w-[50%] mr-[5px]">
            <fieldset class="rounded-[8px] border p-[16px]">
                <legend class="-ml-[4px] px-[4px] text-[14px] font-medium">
                    文本
                </legend>
                <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    输入
                                </span>
                                <n-tooltip trigger="hover" placement="right-start">
                                    <template #trigger>
                                        <svg-icon class="ml-[2px] pb-[5px] text-[12px]"
                                            name="material-symbols:chat-info" />
                                    </template>
                                    <div>
                                        <div>
                                            支持格式:
                                        </div>
                                        <div v-for="m in methods" class="ml-[10px]">
                                            {{ m.example }}
                                        </div>
                                    </div>
                                </n-tooltip>
                            </div>
                        </template>
                        <n-input clearable placeholder="输入单词" v-model:value="model.text" />
                    </n-form-item>
                </n-form>
            </fieldset>
        </div>
        <div class="w-[50%] ml-[5px]">
            <div class="relative flex h-full flex-col rounded-[12px] bg-secondary p-[16px]">
                <n-descriptions label-placement="left" :column="1">
                    <n-descriptions-item v-for="text in textRes">
                        <template #label>
                            <div class="inline-flex">
                                <span class="font-medium">
                                    {{ text.name }}
                                </span>
                                <n-tooltip trigger="hover">
                                    <template #trigger>
                                        <svg-icon class="ml-[2px] pb-[5px] text-[12px]"
                                            name="material-symbols:chat-info" />
                                    </template>
                                    <div>
                                        {{ `示例: ${text.example}` }}
                                    </div>
                                </n-tooltip>
                            </div>
                        </template>
                        <div class="inline-flex" v-if="text.result">
                            <span>
                                {{ text.result }}
                            </span>
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                        name="material-symbols:content-copy" @click="handleCopy(text.result)" />
                                </template>
                                {{ `点击复制` }}
                            </n-tooltip>
                        </div>
                    </n-descriptions-item>
                </n-descriptions>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import * as changeCase from "change-case"
import copy from 'copy-to-clipboard';

defineOptions({
    toolMeta: defineToolMeta({
        title: '更改单词格式',
        description: "更改单词格式",
        category: ToolCategory.text
    })
})
const initialText = 'change-case'
const message = useMessage()
const model = reactive({
    text: initialText
})
const formRef = ref<FormInst | null>(null)
const finalText = computedAsync(
    async () => {
        const color = model.text;
        try {
            await formRef.value?.validate() || {}
        } catch (error) {
            return
        }
        return color
    },
    initialText,
)

const methods: {
    name: string,
    example: string,
    run: (val: string) => string
}[] = [
        { name: "camelCase", example: "twoWords", run: (val) => changeCase.camelCase(val) },
        { name: "capitalCase", example: "Two Words", run: (val) => changeCase.capitalCase(val) },
        { name: "constantCase", example: "TWO_WORDS", run: (val) => changeCase.constantCase(val) },
        { name: "dotCase", example: "two.words", run: (val) => changeCase.dotCase(val) },
        { name: "kebabCase", example: "two-words", run: (val) => changeCase.kebabCase(val) },
        { name: "noCase", example: "two words", run: (val) => changeCase.noCase(val) },
        { name: "pascalCase", example: "TwoWords", run: (val) => changeCase.pascalCase(val) },
        { name: "pascalSnakeCase", example: "Two_Words", run: (val) => changeCase.pascalSnakeCase(val) },
        { name: "pathCase", example: "two/words", run: (val) => changeCase.pathCase(val) },
        { name: "sentenceCase", example: "Two words", run: (val) => changeCase.sentenceCase(val) },
        { name: "snakeCase", example: "two_words", run: (val) => changeCase.snakeCase(val) },
        { name: "trainCase", example: "Two-Words", run: (val) => changeCase.trainCase(val) },
    ]

const textRes = computed(() => {
    const text = finalText.value || "";
    return methods.map(m => {
        return {
            ...m,
            result: m.run(text)
        }
    })
})
const rules: FormRules = {
    text: [
        {
            required: true,
            message: '输入单词',
            trigger: ['input', 'change', 'blur', 'focus']
        }
    ]
}
const handleCopy = (val: string) => {
    const res = copy(val);
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}
</script>