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
import fs from "node:fs/promises";
import path from "node:path";

export interface ToolFileInfo {
  name: string;
  filepath: string;
}

const listFiles = async (dir?: string) => {
  const files: string[] = [];
  if (!dir) {
    return [];
  }
  const fileList = await fs.readdir(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    files.push(name);
  }
  return files;
};

const removeExtname = (pathString: string) => {
  const _extname = path.extname(pathString);
  return pathString.slice(0, pathString.length - _extname.length);
};

export default defineNuxtModule(async (options, nuxt) => {
  const resolver = createResolver(import.meta.url);
  const contentFileName = "collect-tools.ts";
  const dirName = "tools";
  const contentComponentPath = await resolvePath(`~/${dirName}`);

  const scanFiles = debounce(async () => {
    const files = await listFiles(contentComponentPath);
    const list: ToolFileInfo[] = files.map((f) => {
      return {
        name: path.basename(f, path.extname(f)),
        filepath: f,
      };
    });
    addTemplate({
      filename: contentFileName,
      write: true,
      getContents: () => {
        const formatToolName = (name: string) => {
          const fullName = `${name}`;
          const pascalCaseName = camelcase(fullName, {
            pascalCase: true,
          });
          return `${pascalCaseName}`;
        };
        return `
${list
  ?.map((e) => {
    return `import ${formatToolName(e.name)} from "${removeExtname(
      e.filepath
    )}"`;
  })
  .join(";\n")}
export const list = [
    ${list
      ?.map((e) => {
        return `{
        name: "${e.name}",
        ...${formatToolName(e.name)}
    }`;
      })
      .join(",\n")}
];
export enum ToolName {
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
      name: "getAllTools",
      as: "getAllTools",
      from: resolver.resolve("runtime/utils"),
    },
    {
      name: "findTool",
      as: "findTool",
      from: resolver.resolve("runtime/utils"),
    },
    {
      name: "ToolName",
      as: "ToolName",
      from: resolver.resolve("runtime/utils"),
    },
    {
      name: "defineTool",
      as: "defineTool",
      from: resolver.resolve("runtime/define-tool"),
    },
  ]);
  await scanFiles();
  nuxt.hook("builder:watch", async (event, path) => {
    console.log(`collect-tools-watch:${path}`);
    if (path.includes(contentComponentPath)) {
      console.log(`collect-tools-watch:re scan`);
      scanFiles();
    }
  });
});
