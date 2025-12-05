"use client";

import { useState } from "react";

interface CancelarPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => Promise<void>;
  pedidoId: string;
}

const MOTIVOS_PREDEFINIDOS = [
  "Falta de producto",
  "Falta de tiempo",
  "El cliente no pagó",
  "El cliente no recogió el alimento",
  "Otro",
];

export default function CancelarPedidoModal({
  isOpen,
  onClose,
  onConfirm,
  pedidoId,
}: CancelarPedidoModalProps) {
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<string>("");
  const [otroMotivo, setOtroMotivo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleConfirm = async () => {
    // Validar que se haya seleccionado un motivo
    if (!motivoSeleccionado) {
      setError("Por favor selecciona un motivo de cancelación");
      return;
    }

    // Si seleccionó "Otro", validar que escribió el motivo
    if (motivoSeleccionado === "Otro" && !otroMotivo.trim()) {
      setError("Por favor especifica el motivo de cancelación");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const motivoFinal =
        motivoSeleccionado === "Otro" ? otroMotivo.trim() : motivoSeleccionado;
      await onConfirm(motivoFinal);
      // Resetear form
      setMotivoSeleccionado("");
      setOtroMotivo("");
      onClose();
    } catch (error) {
      console.error("Error al cancelar pedido:", error);
      setError("Error al cancelar el pedido. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMotivoSeleccionado("");
      setOtroMotivo("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[10000] transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md bg-white rounded-2xl shadow-2xl z-[10001] overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label="Cancelar pedido"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 sm:p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-lg sm:text-xl font-bold font-display">
                Cancelar Pedido
              </h2>
            </div>
            <button
              onClick={handleClose}
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
          {/* Mensaje de advertencia */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 text-center">
              Estás a punto de cancelar este pedido. Por favor, indica el
              motivo.
            </p>
          </div>

          {/* Opciones de motivo */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Motivo de cancelación *
            </label>
            <div className="space-y-2">
              {MOTIVOS_PREDEFINIDOS.map((motivo) => (
                <label
                  key={motivo}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    motivoSeleccionado === motivo
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="motivo"
                    value={motivo}
                    checked={motivoSeleccionado === motivo}
                    onChange={(e) => setMotivoSeleccionado(e.target.value)}
                    className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-sm text-gray-700 font-medium">
                    {motivo}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Campo para "Otro" motivo */}
          {motivoSeleccionado === "Otro" && (
            <div className="space-y-2 animate-fadeIn">
              <label
                htmlFor="otro-motivo"
                className="block text-sm font-semibold text-gray-700"
              >
                Especifica el motivo *
              </label>
              <textarea
                id="otro-motivo"
                value={otroMotivo}
                onChange={(e) => setOtroMotivo(e.target.value)}
                placeholder="Escribe el motivo de la cancelación..."
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 text-right">
                {otroMotivo.length}/200
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50 flex gap-2">
          <button
            onClick={handleClose}
            className="flex-1 px-3 py-2 text-sm border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white hover:border-gray-400 transition-all duration-200"
            disabled={loading}
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !motivoSeleccionado}
            className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <span>Cancelando...</span>
              </>
            ) : (
              <>
                <span>⚠️</span>
                <span>Confirmar Cancelación</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
