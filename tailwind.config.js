/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#15370D", // primary dark green
        sage: "#728E6D", // secondary green
        gold: "#E5CD82", // accent golden
        cream: "#FFF2B4", // light cream
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(21,55,13,0.06), 0 8px 24px -8px rgba(21,55,13,0.14)",
        lift: "0 2px 4px rgba(21,55,13,0.08), 0 18px 40px -12px rgba(21,55,13,0.28)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        ride: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        pop: "pop 0.5s ease-out both",
        slideUp: "slideUp 0.3s ease-out both",
        ride: "ride 0.6s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
