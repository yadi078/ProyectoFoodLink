"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainWrapper from "@/components/layout/MainWrapper";
import CartSidebar from "@/components/cart/CartSidebar";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Detectar si estamos en rutas de vendedor (excepto login/signup)
  const isVendedorPanel = pathname?.startsWith('/vendedor') && 
    !pathname.includes('/login') && 
    !pathname.includes('/signup');
  
  // Si es el panel del vendedor, no mostrar Header, Footer ni CartSidebar
  if (isVendedorPanel) {
    return <>{children}</>;
  }
  
  // Para todas las demás rutas (estudiantes, home, etc.)
  return (
    <>
      <Header />
      <MainWrapper>{children}</MainWrapper>
      <Footer />
      <CartSidebar />
    </>
  );
}

