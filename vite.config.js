import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Local backend started by `npm run dev` (server/server-simple.js)
const API_TARGET = process.env.VITE_API_PROXY || "http://localhost:3000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Every /api request goes to the local backend, matching the production paths
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
});
