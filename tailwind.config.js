const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mahindra': {
          'navy-blue': '#111827',
          'dark-blue': '#0c111b',
          'red': '#DC2626',
          'light-gray': '#9CA3AF',
          'black': '#000000',
          'white': '#F9FAFB'
        },
      },
      fontFamily: {
        'mono': ['"Roboto Mono"', 'monospace']
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],  // Añade el plugin de heroui aquí
};