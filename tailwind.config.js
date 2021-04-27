const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          20: "#F5F5FF",
          40: "#CCCCFF",
          60: "#B8B8FF",
          80: "#A3A3FF",
          100: "#6666FF",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
