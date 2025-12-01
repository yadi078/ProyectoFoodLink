import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainWrapper from "@/components/layout/MainWrapper";
import { AlertProvider } from "@/components/context/AlertContext";
import { CartProvider } from "@/components/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "FoodLink - Conecta estudiantes con comida casera",
  description:
    "Plataforma que conecta estudiantes universitarios con vendedores de comida casera",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#FF6B35",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans flex flex-col min-h-screen`}
      >
        <AlertProvider>
          <CartProvider>
            <Header />
            <MainWrapper>{children}</MainWrapper>
            <Footer />
          </CartProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
