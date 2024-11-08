import {
  addImports,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  resolvePath,
} from "nuxt/kit";
import { debounce } from "perfect-debounce";
import camelcase from "camelcase";
import { listFiles } from "./utils";
import path from "node:path";

export interface ToolContentFileInfo {
  name: string;
  filepath: string;
}

export default defineNuxtModule(async (options, nuxt) => {
  const resolver = createResolver(import.meta.url);
  const contentFileName = "collect-tool-content.ts";
  const contentComponentDirName = "tool-content";
  const contentComponentPath = await resolvePath(
    `~/components/${contentComponentDirName}`
  );
  const scanFiles = debounce(async () => {
    const files = await listFiles(contentComponentPath);
    const list: ToolContentFileInfo[] = files.map((f) => {
      return {
        name: path.basename(f, path.extname(f)),
        filepath: f,
      };
    });
    addTemplate({
      filename: contentFileName,
      write: true,
      getContents: () => {
        const formatComponentName = (name: string) => {
          const fullName = `${contentComponentDirName}-${name}`;
          const pascalCaseName = camelcase(fullName, {
            pascalCase: true,
          });
          return `${pascalCaseName}`;
        };
        return `import { h } from "vue";
${list
  ?.map((e) => {
    return `import {${formatComponentName(e.name)} } from "#components"`;
  })
  .join(";\n")}
export const list = [
    ${list
      ?.map((e) => {
        return `{
        name: "${e.name}",
        content: () => h(${formatComponentName(e.name)})
    }`;
      })
      .join(",\n")}
];
export enum ToolContentName {
${list
  .map((e) => {
    return `"${e.name}" = "${e.name}"`;
  })
  .join(",\n")}
}
`;
      },
    });
  }, 25);
  addImports([
    {
      name: "getAllToolContentList",
      as: "getAllToolContentList",
      from: resolver.resolve("runtime/utils"),
    },
    {
      name: "ToolContentName",
      as: "ToolContentName",
      from: resolver.resolve("runtime/utils"),
    },
  ]);
  await scanFiles();
  nuxt.hook("builder:watch", async (event, path) => {
    if (path.includes(contentComponentPath)) {
      scanFiles();
    }
  });
});
