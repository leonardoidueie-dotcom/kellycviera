import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        grafite: {
          DEFAULT: "#141210",
          claro: "#1E1A17",
          borda: "#2A2521",
        },
        dourado: {
          DEFAULT: "#C9A227",
          claro: "#E0C05A",
          fosco: "#8A6F1C",
        },
        mel: "#B98B52",
        areia: "#E8DFD2",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
