"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MensajeNotificacionProps {
  nombreRemitente: string;
  mensaje: string;
  conversacionId: string;
  tipo: "estudiante" | "vendedor";
  onClose: () => void;
}

export default function MensajeNotificacion({
  nombreRemitente,
  mensaje,
  conversacionId,
  tipo,
  onClose,
}: MensajeNotificacionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setVisible(true), 100);

    // Auto-cerrar después de 5 segundos
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const href =
    tipo === "estudiante" ? "/mensajes" : "/vendedor/mensajes";

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transition-all duration-300 transform ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Link
        href={href}
        onClick={handleClose}
        className="block bg-white rounded-lg shadow-2xl border-l-4 border-primary-500 p-4 max-w-sm hover:shadow-3xl transition-shadow"
      >
        <div className="flex items-start gap-3">
          {/* Icono */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white shadow-md">
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
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-sm text-gray-900">
                Nuevo mensaje
              </p>
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                NUEVO
              </span>
            </div>
            <p className="text-xs font-semibold text-primary-600 mb-1">
              {nombreRemitente}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2">{mensaje}</p>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </Link>
    </div>
  );
}

