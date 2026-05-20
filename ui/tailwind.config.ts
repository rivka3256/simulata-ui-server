/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
              navy: {
          50: "#e3eaf8",
          100: "#b9caee",
          200: "#8da8e3",
          300: "#D65527",
          400: "#59660F",
          500: "#EFC604",
          600: "#C2B68A",
          700: "#959595",
          800: "#37A8D8",
          900: "#274D96",
          950: "#141E52", 
        },
        midnight: {
          50: "#e8eaf0",
          100: "#c5c9d9",
          200: "#9ea5bf",
          300: "#7780a5",
          400: "#596491",
          500: "#3b497d",
          600: "#354275",
          700: "#2d396a",
          800: "#263060",
          900: "#19204d",
          950: "#0d1225",
        },
      },
      fontFamily: {
        heebo: ['Heebo'],
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};