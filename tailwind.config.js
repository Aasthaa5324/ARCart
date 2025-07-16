/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}" // If using App Router
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000", // Your brand color
        secondary: "#ff3333", // Error color from globals.css
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // For better form styling
  ],
};