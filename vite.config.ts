import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed to GitHub Pages under /engineering_portfolio/ in production.
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/engineering_portfolio/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
