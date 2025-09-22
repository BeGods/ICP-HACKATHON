/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        myCustomFont: ["MyCustomFont", "sans-serif"],
        caslonAntique: ["CaslonAntique", "serif"],
      },
      fontSize: {
        primary: "3rem",
        secondary: "2rem",
        tertiary: "1rem"
      },
      screens: {
        "1.3xl": "1425px", // Custom breakpoint for 1400px
        "1.2xl": "1200px", // Custom breakpoint for 1200px
        "1.5md": "900px",
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      colors: {
        baseColor: "#202020",
        highlightColor: "#444",
      },
      borderColor: {
        custom: "#202020",
        "t-custom": "#444",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%) skewX(-12deg)" },
          "100%": { transform: "translateX(200%) skewX(-12deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};
