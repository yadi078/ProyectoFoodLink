import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/components/context/AlertContext";
import { CartProvider } from "@/components/context/CartContext";
import ServiceWorkerInit from "@/components/ServiceWorkerInit";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FoodLink",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "FoodLink",
    title: "FoodLink - Conecta estudiantes con comida casera",
    description:
      "Plataforma que conecta estudiantes universitarios con vendedores de comida casera",
  },
  twitter: {
    card: "summary",
    title: "FoodLink - Conecta estudiantes con comida casera",
    description:
      "Plataforma que conecta estudiantes universitarios con vendedores de comida casera",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#719a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FoodLink" />

        {/* Apple Touch Icons */}
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/ios/152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/ios/180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/ios/167.png"
        />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/ios/32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/ios/16.png"
        />
      </head>
      <body
        className={`${inter.className} flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        {/* Inicializar Service Worker */}
        <ServiceWorkerInit />

        <AlertProvider>
          <CartProvider>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </CartProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
