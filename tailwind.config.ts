/** @type {import('tailwindcss').Config} */
import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Prompt", ...defaultTheme.fontFamily.sans],
        league: ["Bowlby One SC", "sans"],
      },
      backgroundColor: {
        "black-800": "#141414",
      },
      colors: {
        "league-gray-800": "#383838",
        "league-gray-700": "#B8B8B8",
        "league-gray-300": "#DADADA",
        "league-gray-200": "#DBDBDB",
        "league-gray-100": "#E8E7E7",
        "league-red": "#f6050a",
        "league-blue": "#1EF2F1",
      },
    },
  },
  plugins: [],
} satisfies Config;
