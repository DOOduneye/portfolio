import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.davidoduneye.com",
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    },
  },
});
