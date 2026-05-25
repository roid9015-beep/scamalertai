import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070A0F",
        panel: "#0E131B",
        muted: "#8A94A6",
        trust: "#38BDF8",
        mint: "#34D399",
        warning: "#FBBF24",
        danger: "#F87171"
      },
      boxShadow: {
        glow: "0 0 80px rgba(56,189,248,0.14)",
        soft: "0 24px 80px rgba(0,0,0,0.25)"
      }
    }
  },
  plugins: []
};

export default config;
