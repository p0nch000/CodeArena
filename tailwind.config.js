/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'mahindra': {
          'navy-blue': '#111827',
          'red': '#DC2626',
          'light-gray': '#9CA3AF',
          'black': '#000000',
          'white': '#F9FAFB'
        },
      }
    },
  },
  plugins: [],
}; 