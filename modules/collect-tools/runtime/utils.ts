import { list } from "#build/collect-tools";
import type { VNodeChild } from "vue";

export interface Tool {
  name: string;
  title: string;
  content: () => VNodeChild;
  icon: () => VNodeChild;
  description: string;
}

export const getAllTools = (): Tool[] => {
  return [...list];
};

export const findTool = (name: string) => {
  const tools = getAllTools();
  return tools.find((e) => e.name === name);
};

export { ToolName } from "#build/collect-tools";
