import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Production base: v4 is the main site (promoted 2026-11-15). A preview build for
// /engineering_portfolio/v4/ uses SITE_BASE (see the deploy:preview script).
const PROD_BASE = process.env.SITE_BASE ?? "/engineering_portfolio/";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? PROD_BASE : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5175,
    open: false,
  },
});
