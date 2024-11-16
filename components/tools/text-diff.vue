<template>
    <div class="size-full bg-secondary p-[10px] rounded-[12px] border">
        <div class="relative size-full  ">
            <div class="absolute top-0 bottom-0 left-0 right-0">
                <div ref="editorContainer" class="size-full"></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
// TODO:使用@monaco-editor/loader 来加载，不然不能中文化
import * as monaco from 'monaco-editor';

const theme = useTheme();
const editorContainerRef = useTemplateRef("editorContainer");
let editor: monaco.editor.IStandaloneDiffEditor | null = null;

watch(theme.isDark, (val) => {
    if (val) {
        monaco.editor.setTheme("vs-dark")
    } else {
        monaco.editor.setTheme("vs")
    }
}, { immediate: true })

onMounted(() => {
    if (!editorContainerRef.value) {
        return;
    }

    editor = monaco.editor.createDiffEditor(editorContainerRef.value, {
        originalEditable: true,
        useInlineViewWhenSpaceIsLimited: false,
        minimap: {
            enabled: false,
        },
        // contextmenu:false
    });

    editor.setModel({
        original: monaco.editor.createModel(`文本
对比 
123`, 'txt'),
        modified: monaco.editor.createModel(`文本
比对
321`, 'txt'),
    });
});
useResizeObserver(editorContainerRef, async (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect;
    editor?.layout({
        width, height
    });
});

defineOptions({
    toolMeta: defineToolMeta({
        title: '文本对比',
        description: "文本对比",
        category: ToolCategory.text,
        related: [
            {
                title: "Tools-Web - 文本对比",
                url: "https://tools.ranblogs.com/diff"
            },
            {
                title: "IT-TOOLS - 文本比较",
                url: "https://www.aiotools.top/text-diff"
            }
        ]
    })
})
</script>