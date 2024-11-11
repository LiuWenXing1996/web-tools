import { useStyleTag } from "@vueuse/core";
import { kebabCase } from "change-case";
import { useThemeVars } from "naive-ui";

export const useGlobalCssVars = () => {
  const themeVars = useThemeVars();
  const styleTag = useStyleTag("");
  watch(
    themeVars,
    () => {
      const themeVarsValue = themeVars.value;
      const vars = Object.entries(themeVarsValue).map(([key, value]) => {
        const keyFormatted = `--naive-${kebabCase(key)}`;
        return {
          name: keyFormatted,
          value,
        };
      });
      styleTag.css.value = `
:root {
${vars
  .map((v) => {
    return `${v.name}:${v.value}`;
  })
  .join(";\n")}
}
      `;
    },
    {
      immediate: true,
    }
  );
};
