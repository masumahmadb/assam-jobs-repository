/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tea: { 
          50:'#EAF4EE', 100:'#CCE6D6', 200:'#B8D4C4', 300:'#94BE9E', 400:'#2E9A63', 
          500:'#1A8754', 600:'#0B6E4F', 700:'#075A40', 800:'#064A34', 900:'#053D2C' 
        },
        brahma: { 50:'#EAF6F6', 400:'#1C8C8C', 600:'#116363' },
        gamosa: { 500:'#C0392B', 600:'#A5301F' },
        muga: { 
          50:'#FEF9F0', 100:'#FDF3D6', 200:'#FAE7AD', 300:'#F5DB84', 400:'#D7A63A', 
          500:'#C4901F', 600:'#A8781A', 700:'#8C5F16', 800:'#704C12', 900:'#5A3D0F' 
        },
        sand: { 50:'#F7F5F0', 100:'#F0ECE1' }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        assamese: ['"Noto Sans Bengali"', 'sans-serif']
      },
      borderRadius: { xl2: '1.25rem' },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        navPulse: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 rgba(46, 154, 99, 0)' },
          '50%': { opacity: '0.85', boxShadow: '0 0 15px rgba(46, 154, 99, 0.15)' }
        }
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        navPulse: 'navPulse 3s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
