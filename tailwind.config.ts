import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "hsl(var(--page))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",
        text: "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        primary: "hsl(var(--primary))",
        primaryText: "hsl(var(--primary-text))",
        accent: "hsl(var(--accent))",
        accentText: "hsl(var(--accent-text))"
      },
      boxShadow: {
        soft: "0 28px 90px rgba(0, 0, 0, 0.42)"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: []
};

export default config;
