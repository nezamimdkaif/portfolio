import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0a0a", // page: black
          900: "#111111", // panels
          800: "#171717", // raised
          700: "#262626", // hairlines
          600: "#3a3a3a",
        },
        paper: {
          DEFAULT: "#f5f5f5", // main text: white
          dim: "#cfcfcf", // secondary text
          mute: "#b3b3b3", // captions
        },
        signal: {
          DEFAULT: "#3b82f6", // electric blue accent
        },
        mint: "#e5e5e5", // neutral data colour (paired with blue)
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
