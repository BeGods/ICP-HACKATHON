/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "font-celtic",
    "font-egyptian",
    "font-greek",
    "font-norse",

    "border-celtic-primary",
    "border-egyptian-primary",
    "border-greek-primary",
    "border-norse-primary",

    "bg-celtic-primary",
    "bg-egyptian-primary",
    "bg-greek-primary",
    "bg-norse-primary",
    "bg-black",

    "bg-celtic-text",
    "bg-egyptian-text",
    "bg-greek-text",
    "bg-norse-text",

    "outline-celtic-primary",
    "outline-egyptian-primary",
    "outline-greek-primary",
    "outline-norse-primary",

    "text-celtic-primary",
    "text-egyptian-primary",
    "text-greek-primary",
    "text-norse-primary",

    "text-celtic-text",
    "text-egyptian-text",
    "text-greek-text",
    "text-norse-text",

    "scale-0",
    "scale-100",
    "scale-125",
    "left-0",
    "right-0",
  ],
  theme: {
    extend: {
      fontFamily: {
        fof: ["FOF", "sans-serif"],
        celtic: ["Celtic", "FOF"],
        egyptian: ["Egyptian", "FOF"],
        greek: ["Greek", "FOF"],
        norse: ["Norse", "FOF"],
        montserrat: ["Montserrat", "sans-serif"],
        symbols: ["Symbols", "sans-serif"],
        martel: ["Martel", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        hindi: ["Inknut Antiqua", "sans-serif"],
      },
      colors: {
        gold: "var(--gold-primary)",
        dark: "var(--dark)",
        card: "#53371E",
        fof: "var(--game-text-color)",
        borderGray: "#FFFFFF33",
        borderDark: "#414141",
        cardsGray: "#979797",
        textGray: "#707579",
        celtic: {
          primary: "var(--celtic-color)",
          text: "var(--celtic-text)",
        },
        egyptian: {
          primary: "var(--egyptian-color)",
          text: "var(--egyptian-text)",
        },
        greek: {
          primary: "var(--greek-color)",
          text: "var(--greek-text)",
        },
        norse: {
          primary: "var(--norse-color)",
          text: "var(--norse-text)",
        },
      },
      borderRadius: {
        primary: "20px",
      },
      fontSize: {
        primary: "10vw",
        "symbol-sm": "8vw",
        secondary: "14px",
        para: "4.3vw",
        tertiary: "18px",
        "button-primary": "18px",
        "orb-primary": "120px",
        "orb-secondary": "45px",
        "orb-tertiary": "45px",
        booster: "50px",
        sectionHead: "8.5vw",
        num: "9vw",
        numHead: "9vw",
        head: "30px",
        paperHead: "7.65vw",
        paperSub: "6.5vw",
        icon: "50px",
        iconLg: "14vw",
      },
      width: {
        "icon-primary": "55px",
        "icon-secondary": "20px",
        "button-primary": "192px",
        "symbol-primary": "33vw",
        "symbol-secondary": "45px",
      },
      height: {
        "icon-primary": "55px",
        "icon-secondary": "20px",
        "button-primary": "60px",
        "button-secondary": "30px",
        "symbol-primary": "33vw",
        "symbol-secondary": "45px",
      },
      borderWidth: {
        secondary: "0.5px",
      },
      maxWidth: {
        orb: "10vw",
      },
      padding: {
        headSides: "5.5vw",
        headSidesMd: "2vw",
      },
    },
  },
  plugins: [],
};
