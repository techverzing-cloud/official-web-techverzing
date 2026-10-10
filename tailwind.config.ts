import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        spaceMono: ["var(--font-space-mono)", "monospace"],
        lexend: ["var(--font-lexend)", "sans-serif"],
        nunito: ["NunitoSans", "sans-serif"],
      },
    },
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [typography],
};

export default config;
