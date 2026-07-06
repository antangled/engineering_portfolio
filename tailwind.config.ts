import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light register (hero, about) — cool off-white, deliberately NOT cream
        paper: "#F4F5F6",
        surface: "#FFFFFF",
        ink: {
          900: "#15171B",
          700: "#3B3F46",
          500: "#5E636B", // darkened → WCAG AA (≥4.5:1) on paper AND paper-grid
          400: "#767C85", // darkened → ≥3:1 for icons/decor on light
        },
        line: "#E3E5E8",
        // Dark register (gallery, project detail) — near-black, slightly cool
        night: {
          900: "#0C0D10",
          800: "#121419",
          700: "#1A1D23",
          600: "#23272E",
        },
        mist: {
          DEFAULT: "#F1F2F4",
          dim: "#9CA1A8",
          faint: "#8B9099", // lifted → WCAG AA (≥4.5:1) on the dark registers
        },
        // Signal-orange accent (CAD-highlight energy) — one committed accent
        signal: {
          DEFAULT: "#FF5A1F",
          ink: "#D33E08", // darker for AA text on light
          glow: "#FF7A45",
        },
      },
      fontFamily: {
        display: ["'Clash Display'", "system-ui", "sans-serif"],
        sans: ["'General Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
