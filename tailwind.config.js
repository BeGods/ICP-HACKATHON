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

    "text-silver",
    "text-bronze",
    "text-diamond",
    "text-ruby",
    "text-emberald",
    "text-wood",
    "text-gold",

    "pulse-drop-greek",
    "pulse-drop-celtic",
    "pulse-drop-norse",
    "pulse-drop-eygptian",
    "pulse-drop-other"
  ],
  theme: {
    extend: {
      screens: {
        'tablet': '640px',
        'desktop': '1024px',
      },
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
        diamond: "#b9f2ff",
        ruby: "#E0115F",
        emberald: "#50C878",
        topaz: "#FFC067",
        silver: "#808080",
        bronze: "#9b5e20",
        wood: "#A1662F"
      },
      borderRadius: {
        primary: "20px",
      },
      fontSize: {
        primary: "2.5rem",
        "symbol-sm": "2rem",
        secondary: "14px",
        para: "2.25dvh",
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
        paperHead: "3.5dvh",
        paperSub: "3dvh",
        icon: "50px",
        iconLg: "3.75rem",
      },
      width: {
        "icon-primary": "55px",
        "icon-secondary": "20px",
        "button-primary": "12rem",
        "symbol-primary": "7.5rem",
        "symbol-secondary": "45px",
        "item": "14rem"
      },
      height: {
        tgHeight: "90vh",
        "icon-primary": "55px",
        "icon-secondary": "20px",
        "button-primary": "3.5rem",
        "button-secondary": "30px",
        "symbol-primary": "7.5rem",
        "symbol-secondary": "45px",
      },
      borderWidth: {
        secondary: "0.5px",
      },
      maxWidth: {
        orb: "2.6rem",
      },
      padding: {
        headSides: "5.5vw",
        headSidesMd: "2vw",
        headTop: "1.35rem"
      },
      keyframes: {
        shimmer: {},
        shine: {},
        text: {},
      },
    },
  },
  plugins: [],
};
