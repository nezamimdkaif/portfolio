import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0f1a", // page: deep navy-black
          900: "#0e1524", // panels
          800: "#131c2e", // raised
          700: "#1f2a3d", // hairlines
          600: "#2e3b52",
        },
        paper: {
          DEFAULT: "#e6e6e6", // main text
          dim: "#a3acb9", // secondary text
          mute: "#6b7585", // captions
        },
        signal: {
          DEFAULT: "#e8c872", // pale gold accent
        },
        mint: "#9fd3c7", // data highlight
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "72rem",
      },
    },
  },
  plugins: [],
};
export default config;
