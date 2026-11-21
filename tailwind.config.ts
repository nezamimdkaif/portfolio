import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#ffffff", // page
          900: "#f8fafc", // section bands / panels (slate-50)
          800: "#f1f5f9", // hover (slate-100)
          700: "#e2e8f0", // hairlines (slate-200)
          600: "#cbd5e1", // stronger borders (slate-300)
        },
        paper: {
          DEFAULT: "#0f172a", // main text (slate-900)
          dim: "#334155", // secondary text (slate-700)
          mute: "#64748b", // captions (slate-500)
        },
        signal: {
          DEFAULT: "#2563eb", // blue-600 accent
        },
        mint: "#94a3b8", // neutral data colour (paired with blue)
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
