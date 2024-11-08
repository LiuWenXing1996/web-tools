import { ToolContentName } from "#imports";

export const getIgnoreRegisteredTools = (): ToolContentName[] => {
  return [ToolContentName["default-all-tool"]];
};

// export const getAllTools = () => {
//   const tools: Tool[] = [
//     {
//       name: ToolAllPaneName,
//       unClosable: true,
//       content: () => h(ToolContentDefaultAllTool),
//     },
//     {
//       name: "1",
//       content: () => h("div", "1"),
//     },
//   ];
//   return tools;
// };
