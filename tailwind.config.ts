// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Includes all files in the app directory
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Good practice to include if you have a pages dir
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Includes a components directory
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-surface": "var(--bg-surface)",
        "bg-subtle": "var(--bg-subtle)",
        "fg-main": "var(--text-main)",
        "fg-muted": "var(--text-muted)",
        "fg-inverse": "var(--text-inverse)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        brand: "var(--brand)",
      },
    },
  },
  plugins: [],
};
