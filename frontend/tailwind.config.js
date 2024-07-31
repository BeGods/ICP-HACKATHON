/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "border-celtic-primary",
    "border-egyptian-primary",
    "border-greek-primary",
    "border-norse-primary",

    "bg-celtic-primary",
    "bg-egyptian-primary",
    "bg-greek-primary",
    "bg-norse-primary",

    "text-celtic-primary",
    "text-egyptian-primary",
    "text-greek-primary",
    "text-norse-primary",

    "text-celtic-text",
    "text-egyptian-text",
    "text-greek-text",
    "text-norse-text",
  ],
  theme: {
    extend: {
      fontFamily: {
        celtic: ["Celtic", "sans-serif"],
        egyptian: ["Egyptian", "sans-serif"],
        greek: ["Greek", "sans-serif"],
        norse: ["Norse", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        fof: ["FOF", "sans-serif"],
        symbols: ["Symbols", "sans-serif"],
      },
      colors: {
        fof: "var(--game-text-color)",
        borderGray: "#FFFFFF33",
        cardsGray: "#979797",
        celtic: {
          primary: "var(--celtic-color)",
          text: "var(--celtic-text-color)",
        },
        egyptian: {
          primary: "var(--egyptian-color)",
          text: "var(--egyptian-text-color)",
        },
        greek: {
          primary: "var(--greek-color)",
          text: "var(--greek-text-color)",
        },
        norse: {
          primary: "var(--norse-color)",
          text: "var(--norse-text-color)",
        },
      },
      borderRadius: {
        button: "20px",
      },
    },
  },
  plugins: [],
};
