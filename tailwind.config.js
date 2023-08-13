/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./public/pages/aklatan/aklatan.html"],
  theme: {
    colors: {
      'neutral': {
        950: '#0A0A0A'
      },
      'zinc': {
        100: '#F2F0F0'
      },
      'stone': {
        300: '#E7D7C1'
      },
      'red': {
        500: '#BF4342',
        800: '#8C1C13',
        900: '#8B1C13'
      },
    },
    extend: {
      spacing: {
        '1.4' : '5px',
        '11.5': '46px',
        '12.5': '50px',
        '37'  : '150px',
        '42'  : '170px',
        '54'  : '220px',
        '78'  : '300px',
        '100' : '400px'
      },
      gridTemplateRows: {
       '6': 'repeat(6, minmax(0, auto))' 
      },
      gridTemplateColumns: {
        '2'  : 'repeat(2, minmax(0, 200px))',
        '2.5': 'repeat(2, minmax(0, 150px))',
        '3'  : 'repeat(3, minmax(0, 220px))'
      },
    },
  },
  plugins: [],
}