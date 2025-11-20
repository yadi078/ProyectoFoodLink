import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AlertProvider } from '@/components/context/AlertContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FoodLink - Conecta estudiantes con comida casera',
  description: 'Plataforma que conecta estudiantes universitarios con vendedores de comida casera',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AlertProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AlertProvider>
      </body>
    </html>
  )
}

