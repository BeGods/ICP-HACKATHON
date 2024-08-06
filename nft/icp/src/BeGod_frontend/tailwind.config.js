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
      Quicksand  : ["Quicksand", "sans-serif"],
    },
  //  maxWidth:{
  //   "screen": "1920px"
  //  }
  },
  plugins: [],
}