/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    // colors:{
    //   buttonyellow: "#FCD37B"
    // },
    fontFamily:{
      Quicksand: ["Quicksand", "sans-serif"],
      Inter: ["Inter", "sans-serif"],
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
      Montserrat: ["Montserrat", "sans-serif"],
    },
  //  maxWidth:{
  //   "screen": "1920px"
  //  }
  },
  plugins: [],
}