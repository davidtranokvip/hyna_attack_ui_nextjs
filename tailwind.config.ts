import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        card: '#2c2c2c', 
        primary: "rgb(0, 255, 0)",
        myborder: '#444444'
      },
      borderWidth: {
        '1': '1px',
      },
      animation: {
        'scan': 'scan 7.5s linear 0s infinite',
      },
      keyframes: {
        scan: {
          '0%': { backgroundPosition: '0 -100vh' },
          '35%, 100%': { backgroundPosition: '0 100vh' },
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
