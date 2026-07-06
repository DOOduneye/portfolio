import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

// The cloudflare plugin runs the Worker (tRPC + local D1) inside `vite dev`
// and builds it alongside the client — one command for the whole app.
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
});
