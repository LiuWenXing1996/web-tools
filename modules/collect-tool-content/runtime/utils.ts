import { list } from "#build/collect-tool-content";
import type { VNodeChild } from "vue";

export interface ToolContent {
  name: string;
  content: () => VNodeChild;
}

export const getAllToolContentList = (): ToolContent[] => {
  return [...list];
};
export { ToolContentName } from "#build/collect-tool-content";
