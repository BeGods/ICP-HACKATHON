/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        myCustomFont: ["MyCustomFont", "sans-serif"],
        caslonAntique: ["CaslonAntique", "serif"],
      },
    },
  },
  plugins: [],
};
