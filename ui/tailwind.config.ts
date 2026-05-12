/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // צבעי הצי והבסיס של המערכת - מותאמים לפיגמה של Simulata
        navy: {
          50: "#e3eaf8",
          100: "#b9caee",
          200: "#8da8e3",
          300: "#6186d8",
          400: "#426ccf",
          500: "#2353c6",
          600: "#1e4bbd",
          700: "#1640b0",
          800: "#0f36a3",
          900: "#002489",
          950: "#141E52", // הצבע הראשי של הפיגמה שלך! מעכשיו משתמשים ב-bg-navy-950 או text-navy-950
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
        // הצבע הסגול מהפיגמה החדשה
        hydraPurple: '#9747FF', 
      },
      fontFamily: {
        // הגדרת פונט ברירת המחדל של הפרויקט לפי הפיגמה
        heebo: ['Heebo', 'sans-serif'],
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