import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { cloudflare } from "@cloudflare/vite-plugin"

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    // cmdk brings Radix in alongside Base UI. Without this the two resolve
    // against separate React copies and every hook call throws.
    dedupe: ["react", "react-dom"]
  }
})
