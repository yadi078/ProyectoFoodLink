"use client";

import { useState } from "react";
import StarRating from "@/components/common/StarRating";

interface CalificarVendedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (calificacion: number, comentario?: string) => Promise<void>;
  vendedorNombre: string;
  pedidoId: string;
}

export default function CalificarVendedorModal({
  isOpen,
  onClose,
  onSubmit,
  vendedorNombre,
  pedidoId,
}: CalificarVendedorModalProps) {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (calificacion < 1) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(calificacion, comentario.trim() || undefined);
      // Resetear form
      setCalificacion(0);
      setComentario("");
      onClose();
    } catch (error) {
      console.error("Error al enviar calificación:", error);
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

      {/* Modal - Mobile First */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md bg-white rounded-2xl shadow-2xl z-[10001] overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label="Calificar vendedor"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 sm:p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <h2 className="text-lg sm:text-xl font-bold font-display">
                Calificar Servicio
              </h2>
            </div>
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
          {/* Mensaje */}
          <div className="text-center">
            <p className="text-gray-700 text-sm sm:text-base">
              ¿Cómo fue tu experiencia con
            </p>
            <p className="text-primary-600 font-bold text-base sm:text-lg mt-1">
              {vendedorNombre}?
            </p>
          </div>

          {/* Estrellas - Mobile Friendly */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 text-center">
              Tu calificación
            </label>
            <div className="flex justify-center">
              <StarRating
                rating={calificacion}
                interactive={true}
                onRatingChange={setCalificacion}
                size="lg"
              />
            </div>
            <p className="text-center text-xs text-gray-500">
              {calificacion === 0 && "Selecciona una calificación"}
              {calificacion === 1 && "Muy malo"}
              {calificacion === 2 && "Malo"}
              {calificacion === 3 && "Regular"}
              {calificacion === 4 && "Bueno"}
              {calificacion === 5 && "Excelente"}
            </p>
          </div>

          {/* Comentario */}
          <div className="space-y-2">
            <label
              htmlFor="comentario"
              className="block text-sm font-semibold text-gray-700"
            >
              Cuéntanos más (opcional)
            </label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="¿Qué te gustó o qué podría mejorar?"
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 text-right">
              {comentario.length}/500
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800 text-center">
              💡 Tu calificación ayuda a otros estudiantes a elegir mejor
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-sm border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white hover:border-gray-400 transition-all duration-200"
            disabled={loading}
          >
            Ahora no
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || calificacion < 1}
            className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>⭐</span>
                <span>Enviar Calificación</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

