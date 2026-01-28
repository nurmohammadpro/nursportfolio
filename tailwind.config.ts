// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light theme
        background: "#fafafa",
        surface: "#ffffff",
        "surface-variant": "#f5f5f5",
        primary: "#1976d2",
        "on-primary": "#4a3496",
        "primary-container": "#e3f2fd",
        "on-primary-container": "#0d47a1",
        secondary: "#9c27b0",
        "on-secondary": "#ffffff",
        outline: "#79747e",
        "on-surface-variant": "#49454f",
        "on-background": "#1c1b1f",
        "on-surface": "#1c1b1f",
        error: "#ba1a1a",
        "on-error": "#ffffff",

        // Dark theme - will be applied via dark: prefix
        dark: {
          background: "#121212",
          surface: "#1e1e1e",
          "surface-variant": "#2c2c2c",
          primary: "#90caf9",
          "on-primary": "#0d47a1",
          "primary-container": "#1565c0",
          "on-primary-container": "#e3f2fd",
          secondary: "#ce93d8",
          "on-secondary": "#4a148c",
          outline: "#938f99",
          "on-surface-variant": "#cac4d0",
          "on-background": "#e6e1e5",
          "on-surface": "#e6e1e5",
          error: "#ffb4ab",
          "on-error": "#690005",
        },
      },
      boxShadow: {
        "1": "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        "2": "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
        "3": "0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)",
        "4": "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
        "6": "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)",
        "8": "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        ripple: "ripple 0.6s linear",
        shake: "shake 0.5s ease-in-out",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        ripple: {
          from: {
            transform: "scale(0)",
            opacity: "1",
          },
          to: {
            transform: "scale(4)",
            opacity: "0",
          },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
