/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tea: { 50:'#EAF4EE', 100:'#CCE6D6', 400:'#2E9A63', 600:'#0B6E4F', 700:'#075A40', 900:'#053D2C' },
        brahma: { 50:'#EAF6F6', 400:'#1C8C8C', 600:'#116363' },
        gamosa: { 500:'#C0392B', 600:'#A5301F' },
        muga: { 400:'#D7A63A', 500:'#C4901F' },
        sand: { 50:'#F7F5F0', 100:'#F0ECE1' }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        assamese: ['"Noto Sans Bengali"', 'sans-serif']
      },
      borderRadius: { xl2: '1.25rem' }
    }
  },
  plugins: []
}
