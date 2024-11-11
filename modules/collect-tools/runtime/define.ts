import type { VNodeChild } from "vue";

export interface ToolMeta {
  title: string;
  description: string;
  icon: () => VNodeChild;
}
export const defineToolMeta = (meta: ToolMeta) => meta;
