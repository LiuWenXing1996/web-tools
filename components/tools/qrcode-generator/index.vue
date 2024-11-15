<template>
    <tool-item-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
                <tool-item-input-fieldset>
                    <template #label>
                        内容
                    </template>
                    <n-form-item path="data" first label="文本">
                        <n-input clearable placeholder="输入内容" v-model:value="model.data" type="textarea" :rows="3" />
                    </n-form-item>
                    <n-form-item path="img" first label="图标">
                        <n-upload v-model:file-list="iconFileList" list-type="image-card" :max="1" />
                    </n-form-item>
                    <n-form-item path="width" first label="宽度">
                        <n-input-number v-model:value="model.width" :min="1" :step="50">
                            <template #suffix>
                                像素
                            </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="height" first label="高度">
                        <n-input-number v-model:value="model.height" :min="1" :step="50">
                            <template #suffix>
                                像素
                            </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="margin" first label="边距">
                        <n-input-number v-model:value="model.margin" :min="0" :step="10">
                            <template #suffix>
                                像素
                            </template>
                        </n-input-number>
                    </n-form-item>
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        信息点
                    </template>
                    <tools-qrcode-generator-dots-options-form ref="dotsOptions" />
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        定位点
                    </template>
                    <tools-qrcode-generator-corners-options-form ref="cornersOptions" />
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        定位点边框
                    </template>
                    <tools-qrcode-generator-corners-square-options-form ref="cornersSquareOptions" />
                </tool-item-input-fieldset>

            </n-form>
        </template>
        <template #output>
            <div ref="qrCodeRef"></div>
            <n-dropdown trigger="click" :options="downloadFileTypeOptions" @select="handleDownload">
                <n-button secondary type="primary" class="mt-[10px]">
                    下载二维码
                </n-button>
            </n-dropdown>
        </template>
    </tool-item-wrapper>
</template>
<script setup lang="ts">
import type { FormInst, FormRules, SelectOption, UploadFileInfo } from 'naive-ui';
import QRCodeStyling, { type FileExtension, type Gradient, type Options } from 'qr-code-styling';
import type { Model as DotsOptionsFormModel } from "./dots-options-form.vue"
import type { Model as CornersOptionsFormModel } from "./corners-options-form.vue"
import type { Model as CornersSquareOptionsFormModel } from "./corners-square-options-form.vue"
import type { Model as ColorFormModel } from "./color-form.vue"

defineOptions({
    toolMeta: defineToolMeta({
        title: '二维码生成',
        description: "二维码生成",
        category: ToolCategory.picture,
        related: [
            {
                title: "QR Code Styling",
                url: "https://qr-code-styling.com/"
            },
            {
                title: "帮小忙 - 二维码美化",
                url: "https://tool.browser.qq.com/prettify_qrcode.html"
            },
        ]
    })
})
const initialText = '二维码生成';
const dotsOptionsRef = useTemplateRef('dotsOptions');
const cornersOptionsRef = useTemplateRef('cornersOptions');
const cornersSquareOptionsRef = useTemplateRef('cornersSquareOptions');

watch(() => dotsOptionsRef.value?.model, (val) => {
    model.dotsOptions = val
})
watch(() => cornersOptionsRef.value?.model, (val) => {
    model.cornersOptions = val
})
watch(() => cornersSquareOptionsRef.value?.model, (val) => {
    model.cornersSquareOptions = val
})

// 提供一些预设？
// 随机一个预设？
// 增加历史记录功能
// 配置导入和导出？
// TODO:大致完成功能，还差背景色和 logo 设置，还有就是误差率设置

type Model = Pick<Options, "data" | "image" | "width" | "height" | "margin"> & {
    dotsOptions: DotsOptionsFormModel | undefined,
    cornersOptions: CornersOptionsFormModel | undefined,
    cornersSquareOptions: CornersSquareOptionsFormModel | undefined
}

const modelToQrcodeOptions = (model: Model): Options => {
    const utf8_encode = function (s: string) {
        return unescape(encodeURIComponent(s));
    };

    const transformColor = (color: ColorFormModel | undefined): {
        color?: string;
        gradient?: Gradient;
    } => {
        return {
            color: color?.type === "single" ? color.value.single : undefined,
            gradient: color?.type === "gradient" ? {
                type: color.value.gradient?.type || 'linear',
                rotation: (color?.value?.gradient?.rotation || 0) * (Math.PI / 180),
                colorStops: (color?.value?.gradient?.colorStops || []).map(e => {
                    return {
                        ...e,
                        offset: e.offset / 100
                    }
                })
            } : undefined
        }
    }

    return {
        data: utf8_encode(model.data || ""),
        image: model.image,
        height: model.height,
        width: model.width,
        margin: model.margin,
        dotsOptions: {
            type: model.dotsOptions?.type,
            ...transformColor(model.dotsOptions?.color)
        },
        cornersDotOptions: {
            type: model.cornersOptions?.type === "none" ? undefined : model.cornersOptions?.type,
            ...(model.cornersOptions?.color?.isCustom
                ? transformColor(model.cornersOptions?.color?.value)
                : {
                    color: undefined,
                    gradient: undefined
                })
        },
        cornersSquareOptions: {
            type: model?.cornersSquareOptions?.type === "none" ? undefined : model?.cornersSquareOptions?.type,
            ...(model?.cornersSquareOptions?.color?.isCustom
                ? transformColor(model?.cornersSquareOptions?.color?.value)
                : {
                    color: undefined,
                    gradient: undefined
                })
        }
    }
}
const model = reactive<Model>({
    data: initialText,
    image: "",
    width: 200,
    height: 200,
    margin: 10,
    dotsOptions: undefined,
    cornersOptions: undefined,
    cornersSquareOptions: undefined
})

const iconFileList = ref<UploadFileInfo[]>([])
const toBase64 = (file: File) => new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string | null);
    reader.onerror = reject;
});


watch(iconFileList, async () => {
    const file = iconFileList.value[0]?.file
    let text = ""
    if (file) {
        text = await toBase64(file) || ""
    }
    console.log({ text })
    model.image = text
}, { immediate: true })

const qrCode = new QRCodeStyling();
const qrCodeRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
    if (qrCodeRef.value) {
        qrCode.append(qrCodeRef.value)
    }
})

const formRef = ref<FormInst | null>(null)

watch(model, async () => {
    try {
        await formRef.value?.validate() || {}
    } catch (error) {
        return
    }

    const qrCodeOptions = modelToQrcodeOptions(model)
    console.log({
        model: JSON.parse(JSON.stringify(model)),
        qrCodeOptions
    })
    qrCode.update(qrCodeOptions)
}, {
    immediate: true
})

const rules: FormRules = {}

const downloadFileTypeOptionsMap: Record<FileExtension, SelectOption> = {
    svg: { label: "svg" },
    png: { label: "png" },
    jpeg: { label: "jpeg" },
    webp: { label: "webp" }
}
const downloadFileTypeOptions: SelectOption[] = Object.entries(downloadFileTypeOptionsMap).map(([value, option]) => {
    return {
        key: value,
        ...option
    }
})

const handleDownload = async (val: FileExtension) => {
    console.log(val)
    await qrCode.download({ extension: val })
}
</script>