"use client";

import { useState } from "react";

interface ConfirmarPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tipoEntrega: "recoger" | "entrega", direccion?: string, notas?: string) => void;
  totalItems: number;
  totalPrice: string;
}

export default function ConfirmarPedidoModal({
  isOpen,
  onClose,
  onConfirm,
  totalItems,
  totalPrice,
}: ConfirmarPedidoModalProps) {
  const [tipoEntrega, setTipoEntrega] = useState<"recoger" | "entrega">("recoger");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    // Validar dirección si es entrega
    if (tipoEntrega === "entrega" && !direccion.trim()) {
      alert("Por favor ingresa la dirección de entrega");
      return;
    }

    setLoading(true);
    try {
      await onConfirm(
        tipoEntrega,
        tipoEntrega === "entrega" ? direccion : undefined,
        notas.trim() || undefined
      );
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

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-2xl shadow-2xl z-[10001] overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar pedido"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Confirmar Pedido</h2>
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

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Resumen del pedido */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">Productos:</span>
              <span className="font-semibold text-gray-800">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Total a pagar:</span>
              <span className="font-bold text-primary-500 text-lg">
                {totalPrice}
              </span>
            </div>
          </div>

          {/* Tipo de entrega */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              ¿Cómo deseas recibir tu pedido? <span className="text-error-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoEntrega("recoger")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  tipoEntrega === "recoger"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
                disabled={loading}
              >
                <div className="text-2xl mb-1">🚶</div>
                <div className="font-semibold text-sm">Recoger</div>
              </button>
              <button
                type="button"
                onClick={() => setTipoEntrega("entrega")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  tipoEntrega === "entrega"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
                disabled={loading}
              >
                <div className="text-2xl mb-1">🚚</div>
                <div className="font-semibold text-sm">A domicilio</div>
              </button>
            </div>
          </div>

          {/* Dirección de entrega (solo si selecciona entrega) */}
          {tipoEntrega === "entrega" && (
            <div className="space-y-2 animate-fade-in">
              <label
                htmlFor="direccion"
                className="block text-sm font-semibold text-gray-700"
              >
                Dirección de entrega <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej: Calle Principal #123, Col. Centro"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                disabled={loading}
              />
            </div>
          )}

          {/* Notas adicionales */}
          <div className="space-y-2">
            <label
              htmlFor="notas"
              className="block text-sm font-semibold text-gray-700"
            >
              Notas adicionales (opcional)
            </label>
            <textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Sin cebolla, extra salsa..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
              disabled={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white hover:border-gray-400 transition-all duration-200"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading}
            className="flex-1 btn-primary text-center shadow-medium hover:shadow-large disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
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
                Procesando...
              </>
            ) : (
              "Confirmar Pedido"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

