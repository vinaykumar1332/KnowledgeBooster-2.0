// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api/appsProxy": {
        target: "https://script.google.com",
        changeOrigin: true,
        secure: true,
        rewrite: () =>
          "/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
      },
      "/api/filesProxy": {
        target: "https://script.google.com",
        changeOrigin: true,
        secure: true,
        rewrite: () =>
          "/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec",
      },
    },
  },
});
