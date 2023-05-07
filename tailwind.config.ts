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
        "league-gray-1": "#ECECEC",
        "league-gray-2": "#E8E8E8",
        "league-gray-3": "#DBDBDB",
        "league-gray-4": "#BABABA",
        "league-gray-5": "#7F7F7F",
        "league-gray-6": "#383838",
        "league-red": "#f6050a",
        "league-blue": "#1EF2F1",
      },
    },
  },
  plugins: [],
} satisfies Config;
