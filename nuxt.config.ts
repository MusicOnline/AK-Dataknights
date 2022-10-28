import { generateDataFiles } from "./tools/generate-data";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  hooks: {
    "build:before": async () => {
      await generateDataFiles();
    },
  },
  vite: {
    // https://github.com/nuxt/framework/issues/7794
    devBundler: "legacy",
  },
});
