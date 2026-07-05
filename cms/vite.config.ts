import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // `npm run dev:api` serves the worker on 8787
      "/trpc": "http://localhost:8787",
    },
  },
});
