import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< Updated upstream
=======
        // Naranja (Primary - Acciones principales) - Colores más claros
>>>>>>> Stashed changes
        primary: {
          50: '#fffbf5',
          100: '#fff4e6',
          200: '#ffe8cc',
          300: '#ffd9b3',
          400: '#ffc999',
          500: '#ffb366',  // Más claro
          600: '#ff9933',  // Principal para navbar
          700: '#ff8800',
          800: '#e67a00',
          900: '#cc6b00',
        },
<<<<<<< Updated upstream
=======
        // Verde (Success, positivo, comida saludable) - Colores más claros
        green: {
          50: '#f0fff4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#6ee7b7',  // Más claro para texto en navbar
          500: '#4ade80',
          600: '#34d399',  // Más claro
          700: '#10b981',
          800: '#059669',
          900: '#047857',
        },
        // Amarillo (Warning, destacados, energía) - Colores más claros
        yellow: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
>>>>>>> Stashed changes
      },
    },
  },
  plugins: [],
}
export default config

