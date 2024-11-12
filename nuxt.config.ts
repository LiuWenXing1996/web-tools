import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  app: {
    baseURL: "/web-tools/",
    buildAssetsDir: "/static/",
  },
  modules: [
    "@element-plus/nuxt",
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
  ],
  routeRules: {
    "/**/**": { ssr: false },
    "/system/**": { ssr: false },
    "/tools-old/**": { ssr: false },
    "/tools/**": { ssr: false },
  },
  vite: {
    plugins: [
      AutoImport({
        dts: true,
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
    ssr: {
      noExternal: ["naive-ui", "date-fns"],
    },
  },
  pages: true,
  icon: {
    // mode: "svg",
    serverBundle: {
      collections: ["ep", "ic", "ri", "material-symbols", "iconoir"],
    },
    customCollections: [
      {
        prefix: "custom",
        dir: "./assets/icons",
      },
    ],
  },
  experimental: {
    payloadExtraction: false,
  },
});
