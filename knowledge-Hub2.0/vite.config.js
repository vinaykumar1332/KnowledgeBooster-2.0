import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/appProxy": {
        target:
          "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace("/api/appProxy", ""),
      },
    },
  },
});
