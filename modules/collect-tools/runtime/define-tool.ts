import type { Tool } from "./utils";

export const defineTool = (tool: Omit<Tool, "name">) => tool;
