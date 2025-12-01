/**
 * Componente de Tarjeta de Producto
 * Muestra la información de un producto en formato de tarjeta
 */

"use client";

import type { Platillo } from "@/lib/firebase/types";

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
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-200 border border-gray-200 hover:border-primary-500 hover:-translate-y-1">
      {/* Imagen del Producto */}
      <div className="relative h-48 bg-gray-100">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x300?text=Sin+Imagen";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {/* Badge de Disponibilidad */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-soft ${
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
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">
            {producto.nombre}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {producto.categoria}
          </p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-500">
            ${producto.precio.toFixed(2)}
          </span>
          {producto.cantidadDisponible !== undefined && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg font-medium">
              Stock: {producto.cantidadDisponible}
            </span>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(producto)}
            className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-200 text-sm font-semibold shadow-soft hover:shadow-medium"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(producto.id)}
            className="flex-1 px-4 py-2.5 bg-error-500 text-white rounded-xl hover:bg-error-600 transition-all duration-200 text-sm font-semibold shadow-soft hover:shadow-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
