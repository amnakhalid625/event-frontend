/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      screens: {
        small: "450px",
        tablet: "768px",
        desktop: "1024px",
        large: "1280px",
        xlarge: "1536px",
      },
      colors: {
        primary: "#DC2626",
        secondary: "#010767",
        hoverColor: "#FE5F1B",
        background: "#fef3ed",
        text: "#ffffff",
        secondaryText: "#000000",
        border: "#DDDDDD",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee 50s linear infinite",
        "marquee-right": "marquee-right 45s linear infinite",
      },
    },
  },
  plugins: [],
};
