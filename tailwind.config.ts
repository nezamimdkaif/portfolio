import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0c0e", // page
          900: "#111316", // panels
          800: "#181b1f", // raised
          700: "#24282e", // hairlines
          600: "#353a42",
        },
        paper: {
          DEFAULT: "#ece8e1", // main text, warm off-white
          dim: "#a8a39a", // secondary text
          mute: "#77726a", // captions
        },
        signal: {
          DEFAULT: "#ff6b35", // aviation orange, used sparingly
        },
        mint: "#7fd1b9", // data highlight (map hits, "OK")
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
