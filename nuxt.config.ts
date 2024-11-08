export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt", "@nuxt/icon", "@nuxtjs/tailwindcss"],
  routeRules: {
    "/**/**": { ssr: false },
    "/system/**": { ssr: false },
    "/tools/**": { ssr: false },
  },
  pages: true,
  icon: {
    serverBundle: {
      collections: ["ep", "ic","ri"],
    },
    customCollections: [
      {
        prefix: "custom",
        dir: "./assets/icons",
      },
    ],
  },
});
