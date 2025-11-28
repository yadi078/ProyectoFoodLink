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
        isHomePage ? "pt-0" : "pt-16 lg:pt-20"
      }`}
    >
      {children}
    </main>
  );
}

