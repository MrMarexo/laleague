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
      },
    },
  },
  plugins: [],
} satisfies Config;
