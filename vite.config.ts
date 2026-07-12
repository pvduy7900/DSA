import { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dsaApiPlugin } from "./vite-plugin-dsa-api.mjs";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  plugins: [react(), dsaApiPlugin()],
  server: {
    port: 5174,
    open: true,
  },
});
