"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <main
      className={`flex-grow ${
        isHomePage ? "pt-[60px] sm:pt-[64px] md:pt-[70px]" : "pt-16 lg:pt-20"
      }`}
    >
      {children}
    </main>
  );
}
