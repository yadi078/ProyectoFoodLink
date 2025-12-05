/**
 * Componente de Tarjeta de Producto
 * Muestra la información de un producto en formato de tarjeta
 */

"use client";

import type { Platillo } from "@/lib/firebase/types";
import Image from "next/image";
import { formatPrice } from "@/utils/formatters";

interface ProductoCardProps {
  producto: Platillo;
  onEdit: (producto: Platillo) => void;
  onDelete: (productoId: string) => void;
}

export default function ProductoCard({
  producto,
  onEdit,
  onDelete,
}: ProductoCardProps) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-200 border border-gray-200 hover:border-primary-500 hover:-translate-y-1">
      {/* Imagen del Producto */}
      <div className="relative h-32 sm:h-40 md:h-48 bg-gray-100 overflow-hidden">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            width={400}
            height={300}
            className="w-full h-full object-cover object-center"
            style={{ objectFit: "cover", objectPosition: "center" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x300?text=Sin+Imagen";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl sm:text-3xl md:text-4xl">🍽️</span>
          </div>
        )}
        {/* Badge de Disponibilidad */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 md:top-3 md:right-3">
          <span
            className={`px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold shadow-soft ${
              producto.disponible
                ? "bg-success-500 text-white"
                : "bg-error-500 text-white"
            }`}
          >
            {producto.disponible ? "Disponible" : "No Disponible"}
          </span>
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-3 sm:p-4 md:p-5">
        <div className="mb-2 sm:mb-2.5 md:mb-3">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 line-clamp-1 mb-1">
            {producto.nombre}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {producto.categoria}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-3.5 md:mb-4 leading-relaxed">
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between mb-3 sm:mb-3.5 md:mb-4">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary-500">
            ${producto.precio.toFixed(2)}
          </span>
        </div>

        {/* Botones de Acción */}
        <div className="flex space-x-1.5 sm:space-x-2">
          <button
            onClick={() => onEdit(producto)}
            className="flex-1 px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 bg-primary-500 text-white rounded-lg sm:rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-200 text-xs sm:text-sm font-semibold shadow-soft hover:shadow-medium"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(producto.id)}
            className="flex-1 px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 bg-error-500 text-white rounded-lg sm:rounded-xl hover:bg-error-600 hover:text-white transition-all duration-200 text-xs sm:text-sm font-semibold shadow-soft hover:shadow-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
