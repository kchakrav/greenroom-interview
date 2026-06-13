import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#07090F",
        elevated: "#0D1018",
        glass: "rgba(255,255,255,0.04)",
        "glass-strong": "rgba(255,255,255,0.08)",
        hair: "rgba(255,255,255,0.10)",
        ink: { primary: "#F4F6FB", secondary: "#A6AFC2", muted: "#5C6479" },
        accent: { DEFAULT: "#6E8BFF", 2: "#9B6BFF" },
        signal: { ok: "#3FE0A5", warn: "#FFC56E", bad: "#FF6E8B" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        breathe: {
          "0%,100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        breathe: "breathe 4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
