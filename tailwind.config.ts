/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Prompt", ...defaultTheme.fontFamily.sans],
        league: ['Bowlby One SC', 'sans'],
      },
      backgroundColor: {
        'black-800': '#141414',
      },
      colors: {
        "text-league-gray-800": '#e5e5e6',
      },
    },
  },
  plugins: [],
} satisfies Config;
