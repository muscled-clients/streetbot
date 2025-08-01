import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700",
        "bg-primary": "#000000",
        "bg-secondary": "#1a1a1a",
        "text-primary": "#FFFFFF",
        "text-secondary": "#999999",
      },
      borderRadius: {
        'button': '25px',
      },
    },
  },
  plugins: [],
};
export default config;