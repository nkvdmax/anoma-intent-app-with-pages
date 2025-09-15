/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#eef8ff",100:"#d9ecff",200:"#bfe0ff",300:"#96caff",
          400:"#5faaff",500:"#3f8bff",600:"#2e6ff0",700:"#2357c2",
          800:"#1e4698",900:"#1b3b7a"
        },
        ink: "#0b0f1a"
      },
      dropShadow: { glow: "0 0 35px rgba(63,139,255,.55)" }
    },
  },
  plugins: [],
};
