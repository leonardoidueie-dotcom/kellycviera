import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // fundo quente: quase preto, mas puxado para a madeira
        grafite: {
          DEFAULT: "#171008",
          claro: "#241A11",
          borda: "#3A2A1C",
        },
        // marrons intermediários, para as camadas entre o fundo e o dourado
        casca: {
          DEFAULT: "#4A3524",
          claro: "#6B4B31",
        },
        dourado: {
          DEFAULT: "#C9A227",
          claro: "#E0C05A",
          fosco: "#8A6F1C",
        },
        mel: "#B98B52",
        areia: "#EFE3D2",
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
