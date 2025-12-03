"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function VendedorSidebar() {
  const pathname = usePathname();
  const { vendedor } = useAuth();

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/vendedor/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "Órdenes",
      href: "/vendedor/ordenes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: "Menú",
      href: "/vendedor/menu",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-primary-600 text-white shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-primary-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-2xl">
            🍽️
          </div>
          <div>
            <h1 className="font-bold text-lg font-display">FoodLink</h1>
          </div>
        </div>
        <p className="text-primary-100 text-sm">Panel de Administración</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-primary-50 hover:bg-primary-500/50 hover:text-white"
                  }`}
                >
                  <div className={`flex-shrink-0 ${isActive ? "text-white" : "text-primary-200 group-hover:text-white"}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium flex-1">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-error-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      {vendedor && (
        <div className="p-4 border-t border-primary-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center font-bold text-white">
              {vendedor.nombre?.[0]?.toUpperCase() || "V"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{vendedor.nombre}</p>
              <p className="text-primary-200 text-xs truncate">
                {vendedor.nombreNegocio || "Vendedor"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

