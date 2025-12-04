"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useResenasCount } from "@/hooks/useResenasCount";
import { useMensajesNoLeidos } from "@/hooks/useMensajesNoLeidos";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  dynamicBadge?: boolean;
}

interface VendedorSidebarProps {
  onClose?: () => void;
}

export default function VendedorSidebar({ onClose }: VendedorSidebarProps) {
  const pathname = usePathname();
  const { vendedor } = useAuth();
  const { count: resenasCount } = useResenasCount(vendedor?.uid);
  const { totalNoLeidos: mensajesNoLeidos } = useMensajesNoLeidos(
    vendedor?.uid,
    "vendedor"
  );

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/vendedor/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Órdenes",
      href: "/vendedor/ordenes",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: "Menú",
      href: "/vendedor/menu",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      name: "Mensajes",
      href: "/vendedor/mensajes",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      badge: mensajesNoLeidos,
      dynamicBadge: true,
    },
    {
      name: "Reseñas",
      href: "/vendedor/resenas",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      badge: resenasCount,
      dynamicBadge: true,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#DCE8C3] text-[#2E2E2E] shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#2E2E2E]/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl font-bold text-[#719A0A]">
            🍽️
          </div>
          <div>
            <h1 className="font-bold text-lg font-display">FoodLink</h1>
          </div>
        </div>
        <p className="text-[#2E2E2E]/70 text-sm">Panel de Administración</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#FFA552] text-white shadow-md"
                      : "text-[#2E2E2E] hover:bg-[#719A0A] hover:text-white"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-[#2E2E2E] group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium flex-1">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-error-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
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
        <div className="p-4 border-t border-[#2E2E2E]/10">
          <Link
            href="/vendedor/configuracion"
            onClick={handleLinkClick}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#719A0A]/10 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#FFA552] rounded-full flex items-center justify-center font-bold text-white shadow-md group-hover:shadow-lg transition-shadow">
              {vendedor.nombre?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-[#2E2E2E]">
                {vendedor.nombre}
              </p>
              <p className="text-[#2E2E2E]/60 text-xs truncate">
                {vendedor.nombreNegocio || "Administrador"}
              </p>
            </div>
            <svg
              className="w-4 h-4 text-[#2E2E2E]/40 group-hover:text-[#719A0A] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      )}
    </aside>
  );
}
