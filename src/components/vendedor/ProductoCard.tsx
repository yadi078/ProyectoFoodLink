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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen del Producto */}
      <div className="relative h-48 bg-gray-200">
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
        <div className="absolute top-2 right-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              producto.disponible
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {producto.disponible ? "Disponible" : "No Disponible"}
          </span>
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {producto.nombre}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{producto.categoria}</p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ${producto.precio.toFixed(2)}
          </span>
          {producto.cantidadDisponible !== undefined && (
            <span className="text-sm text-gray-500">
              Stock: {producto.cantidadDisponible}
            </span>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(producto)}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(producto.id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

