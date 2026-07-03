import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: "#f2f9ff",
          100: "#dff0ff",
          200: "#b9e2ff",
          300: "#7bcaff",
          400: "#35a9f3",
          500: "#0f8bdc",
          600: "#006fb9",
          700: "#075a95",
          800: "#0c4d7b",
          900: "#103f66"
        },
        clinical: {
          50: "#f8fafc",
          100: "#eef4f8",
          200: "#dde8ef",
          700: "#31485d",
          900: "#132638"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 61, 96, 0.13)",
        card: "0 8px 26px rgba(15, 61, 96, 0.07)"
      }
    }
  },
  plugins: []
};

export default config;
