/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}", // garante que tudo na pasta src use Tailwind
    ],
    theme: {
      extend: {
        keyframes: {
          float: {
            '0%, 100%': { 
              transform: 'translateY(0) rotate(0deg)',
              opacity: '0.5'
            },
            '50%': { 
              transform: 'translateY(-20px) rotate(5deg)',
              opacity: '1'
            }
          }
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'float-delay-1': 'float 6s ease-in-out infinite 2s',
          'float-delay-2': 'float 6s ease-in-out infinite 4s',
        }
      },
    },
    plugins: [],
  }
  