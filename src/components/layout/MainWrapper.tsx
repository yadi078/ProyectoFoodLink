"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMensajesPage = pathname === "/mensajes";

  // Para la página de mensajes, usar layout full-screen sin padding
  // El header mide 64px (h-16) y el bottom nav aproximadamente 60px
  if (isMensajesPage) {
    return (
      <main className="fixed top-16 bottom-[60px] left-0 right-0 overflow-hidden w-full">
        {children}
      </main>
    );
  }

  // Para todas las demás páginas, agregar padding superior por el header fixed
  return (
    <main className="flex-grow pb-24 pt-16">
      {children}
    </main>
  );
}
