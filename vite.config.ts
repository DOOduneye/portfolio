import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // `npm run dev:api` serves the worker (tRPC + D1) on 8787
      "/trpc": "http://localhost:8787",
    },
  },
});
