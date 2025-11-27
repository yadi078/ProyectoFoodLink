import type { Metadata } from "next";
import { Open_Sans, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AlertProvider } from "@/components/context/AlertContext";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-sans",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700"],
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
  themeColor: "#fbaf32",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${openSans.variable} ${nunito.variable} font-sans flex flex-col min-h-screen`}
      >
        <AlertProvider>
          <Header />
          <main className="flex-grow pt-16 lg:pt-20">{children}</main>
          <Footer />
        </AlertProvider>
      </body>
    </html>
  );
}
