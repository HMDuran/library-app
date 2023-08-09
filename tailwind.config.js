/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./public/pages/aklatan/aklatan.html"],
  theme: {
    colors: {
      'black': '"#000',
      'neutral': {
        950: '#0A0A0A',
      },
      'zinc': {
        100:'#F2F0F0',
      },
      'stone': {
        300: '#E7D7C1',
      },
      'red': {
        500: '#BF4342',
        800: '#8C1C13',
        900: '#8B1C13',
      },
    },
    spacing: {
      '2': '5px',
      '11': '46px',
      '54': '220px',
    },
    borderRadius: {
      '20':'20px',
      '30': '30px',
    },
    extend: {},
  },
  plugins: [],
}