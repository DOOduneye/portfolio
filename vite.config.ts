import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  preview: {
    allowedHosts: ["davidoduneye.com", "www.davidoduneye.com"],
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      tsr: {
        routeFileIgnorePattern: "api/",
      },
    }),
  ],
});
