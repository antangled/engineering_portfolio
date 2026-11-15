import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Production base: the v4 preview lives at /engineering_portfolio/v4/ until it is
// promoted. Promote by building with SITE_BASE=/engineering_portfolio/.
const PROD_BASE = process.env.SITE_BASE ?? "/engineering_portfolio/v4/";

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
