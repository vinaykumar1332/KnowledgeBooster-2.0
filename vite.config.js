import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
      proxy: {
        "/api/auth": {
          target: process.env.VITE_AUTH_URL || "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
          changeOrigin: true,
          secure: true,
          rewrite: () => "",
        },
        "/api/files": {
          target: process.env.VITE_FILES_URL || "https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec",
          changeOrigin: true,
          secure: true,
          rewrite: () => "",
        },
    },
  },
});