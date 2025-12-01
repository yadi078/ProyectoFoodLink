import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primario: #719a0a (Verde oliva - color original)
        primary: {
          50: "#f5f8f0",
          100: "#e8f0d8",
          200: "#d1e1b1",
          300: "#bad28a",
          400: "#a3c363",
          500: "#719a0a", // Color primario principal
          600: "#5a7b08",
          700: "#435c06",
          800: "#2c3d04",
          900: "#151e02",
        },
        // Secundario: #FFA552 (Naranja claro, complementario)
        secondary: {
          50: "#fff9f0",
          100: "#fff2e0",
          200: "#ffe5c0",
          300: "#ffd8a0",
          400: "#ffcb80",
          500: "#FFA552", // Color secundario principal
          600: "#e6943a",
          700: "#cc8322",
          800: "#b3720a",
          900: "#996100",
        },
        // Fondo principal: #F9FAFB
        background: {
          DEFAULT: "#F9FAFB",
          card: "#FFFFFF",
        },
        // Texto principal: #1F2937
        text: {
          primary: "#1F2937",
          secondary: "#6B7280",
        },
        // Gris claro: #E5E7EB
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        // Éxito: #10B981
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Error: #EF4444
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#EF4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Poppins", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
        medium: "0 4px 16px rgba(0, 0, 0, 0.12)",
        large: "0 8px 24px rgba(0, 0, 0, 0.16)",
      },
      transitionDuration: {
        "200": "200ms",
        "250": "250ms",
      },
    },
  },
  plugins: [],
};
export default config;
