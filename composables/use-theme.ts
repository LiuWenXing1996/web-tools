import { darkTheme } from "naive-ui";

export const useTheme = () => {
  const colorMode = useColorMode();
  console.log({
    colorMode: colorMode.preference,
  });
  const isDark = computed(() => {
    return colorMode.preference === "dark";
  });
  const current = computed(() => {
    if (isDark.value) {
      return darkTheme;
    }
    return null;
  });
  const toggle = () => {
    if (isDark.value) {
      colorMode.preference = "light";
    } else {
      colorMode.preference = "dark";
    }
  };
  return {
    toggle,
    current,
    isDark,
  };
};
