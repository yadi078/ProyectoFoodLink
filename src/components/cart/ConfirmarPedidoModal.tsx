"use client";

import { useState } from "react";

interface ConfirmarPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    notas?: string;
    tipoEntrega: "entrega" | "recoger";
    codigoPromocional?: string;
  }) => void;
  totalItems: number;
  totalPrice: string;
  descuentoAplicado?: number;
}

export default function ConfirmarPedidoModal({
  isOpen,
  onClose,
  onConfirm,
  totalItems,
  totalPrice,
  descuentoAplicado = 0,
}: ConfirmarPedidoModalProps) {
  const [notas, setNotas] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "recoger">(
    "entrega"
  );
  const [codigoPromocional, setCodigoPromocional] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      await onConfirm({
        notas: notas.trim() || undefined,
        tipoEntrega,
        codigoPromocional: codigoPromocional.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[10000] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal - Mobile First con scroll */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md bg-white rounded-2xl shadow-2xl z-[10001] overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar pedido"
      >
        {/* Header - Fijo */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 sm:p-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold font-display">
              Confirmar Pedido
            </h2>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-200"
              aria-label="Cerrar modal"
              disabled={loading}
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {/* Resumen del pedido */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">
                Productos:
              </span>
              <span className="font-semibold text-gray-800 text-sm">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            {descuentoAplicado > 0 && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span className="text-xs sm:text-sm">Descuento:</span>
                <span className="font-semibold text-sm">
                  -${descuentoAplicado.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm">
                Total a pagar:
              </span>
              <span className="font-bold text-primary-500 text-base sm:text-lg">
                {totalPrice}
              </span>
            </div>
          </div>

          {/* Método de entrega - Mobile First */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              🚚 Método de entrega
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipoEntrega("entrega")}
                disabled={loading}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  tipoEntrega === "entrega"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">📍</div>
                  <div className="text-xs font-semibold text-gray-800">
                    Entrega
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    Puerta UTNA
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setTipoEntrega("recoger")}
                disabled={loading}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  tipoEntrega === "recoger"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🏃</div>
                  <div className="text-xs font-semibold text-gray-800">
                    Recoger
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    En el lugar
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Información según método */}
          <div
            className={`rounded-lg p-3 border ${
              tipoEntrega === "entrega"
                ? "bg-blue-50 border-blue-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex gap-2">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-base ${
                    tipoEntrega === "entrega" ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {tipoEntrega === "entrega" ? "📍" : "🏃"}
                </div>
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold text-sm mb-1 ${
                    tipoEntrega === "entrega"
                      ? "text-blue-900"
                      : "text-green-900"
                  }`}
                >
                  {tipoEntrega === "entrega"
                    ? "Entrega en la puerta principal de la UTNA"
                    : "Recoger en el lugar del vendedor"}
                </h3>
                <div
                  className={`text-xs space-y-1 ${
                    tipoEntrega === "entrega"
                      ? "text-blue-800"
                      : "text-green-800"
                  }`}
                >
                  {tipoEntrega === "entrega" ? (
                    <>
                      <p>✓ Punto de encuentro único</p>
                      <p>✓ Pago en efectivo</p>
                      <p>✓ Horario escolar</p>
                    </>
                  ) : (
                    <>
                      <p>✓ Recoge directamente con el vendedor</p>
                      <p>✓ Pago en efectivo</p>
                      <p>✓ Coordina horario con el vendedor</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Código promocional */}
          <div className="space-y-2">
            <label
              htmlFor="codigo"
              className="block text-sm font-semibold text-gray-700"
            >
              🎁 Código promocional (opcional)
            </label>
            <input
              id="codigo"
              type="text"
              value={codigoPromocional}
              onChange={(e) =>
                setCodigoPromocional(e.target.value.toUpperCase())
              }
              placeholder="Ej: PROMO10"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 uppercase"
              disabled={loading}
            />
            <p className="text-[10px] text-gray-500">
              Si tienes un código, ingrésalo para obtener descuento
            </p>
          </div>

          {/* Notas adicionales */}
          <div className="space-y-2">
            <label
              htmlFor="notas"
              className="block text-sm font-semibold text-gray-700"
            >
              📝 Notas adicionales (opcional)
            </label>
            <textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Sin cebolla, extra salsa..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
              disabled={loading}
            />
          </div>
        </div>

        {/* Footer - Fijo */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50 flex gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-sm border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white hover:border-gray-400 transition-all duration-200"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading}
            className="flex-1 btn-primary text-sm text-center shadow-medium hover:shadow-large disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-xs sm:text-sm">Procesando...</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm">Confirmar Pedido</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
