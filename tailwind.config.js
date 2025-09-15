/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0b0f",     // чорний фон
        paper: "#ffffff",   // білий
        brand: {
          50:"#fff1f2",100:"#ffe4e6",200:"#fecdd3",300:"#fda4af",
          400:"#fb7185",500:"#ef4444",600:"#dc2626",700:"#b91c1c",
          800:"#991b1b",900:"#7f1d1d"
        }
      },
      dropShadow: {
        redglow: "0 0 30px rgba(239,68,68,.55)"
      }
    },
  },
  plugins: [],
};
