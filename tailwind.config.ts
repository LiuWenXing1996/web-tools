import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: "var(--el-color-primary)",
      },
    },
  },
  plugins: [],
  content: [],
};
