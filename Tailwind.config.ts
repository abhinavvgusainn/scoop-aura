import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fontFamily: {
  playfair: ["var(--font-playfair)"],
  quicksand: ["var(--font-quicksand)"],
},
        quicksand: ["Quicksand", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      colors: {
        pink: {
          light: "#FFB6C1",
          deep: "#FF8FAB",
        },
        lavender: {
          DEFAULT: "#C8B2E8",
          light: "#E8DCFF",
        },
        peach: "#FFCBA4",
        cream: "#FFF9F0",
        "blue-pastel": "#B8D8F8",
        "purple-light": "#D4BAFF",
        "text-dark": "#3D2C47",
        "text-mid": "#7A5C8A",
        "text-soft": "#A887B8",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateX(-50%) translateY(24px)" },
          "100%": { opacity: "1", transform: "translateX(-50%) translateY(0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        floatBox: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        floatItem: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        sparkleAnim: {
          "0%": { opacity: "0.4", transform: "scale(0.8) rotate(0deg)" },
          "100%": { opacity: "1", transform: "scale(1.2) rotate(20deg)" },
        },
        blobDrift: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(30px, 40px) scale(1.08)" },
        },
      },
      animation: {
        slideUp: "slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        fadeUp: "fadeUp 0.6s ease both",
        floatBox: "floatBox 4s ease-in-out infinite",
        floatItem: "floatItem 4s ease-in-out infinite",
        sparkle: "sparkleAnim 2s ease-in-out infinite alternate",
        blobDrift: "blobDrift 12s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;