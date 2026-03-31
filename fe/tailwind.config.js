/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "856px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        primary: "#8B0000", // đỏ đậm
        secondary: "#FF8C00", // cam
        accent: "#FFD700", // vàng
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 30% 30%, rgba(255,140,0,0.3), transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,215,0,0.2), transparent 50%)",
      },
    },
  },
  plugins: [],
};
