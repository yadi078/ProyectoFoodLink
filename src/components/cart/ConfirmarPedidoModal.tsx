"use client";

import { useState, useEffect } from "react";

interface ConfirmarPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    notas?: string;
    horaEntrega: string;
    codigoPromocional?: string;
  }) => void;
  totalItems: number;
  totalPrice: string;
  descuentoAplicado?: number;
  vendedoresInfo?: Array<{
    vendedorId: string;
    horario?: { inicio: string; fin: string };
  }>;
}

export default function ConfirmarPedidoModal({
  isOpen,
  onClose,
  onConfirm,
  totalItems,
  totalPrice,
  descuentoAplicado = 0,
  vendedoresInfo = [],
}: ConfirmarPedidoModalProps) {
  const [notas, setNotas] = useState("");
  const [horaEntrega, setHoraEntrega] = useState("");
  const [codigoPromocional, setCodigoPromocional] = useState("");
  const [codigoTemporal, setCodigoTemporal] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorHora, setErrorHora] = useState("");
  const [mensajeDescuento, setMensajeDescuento] = useState("");
  const [aplicandoCodigo, setAplicandoCodigo] = useState(false);

  // Obtener horarios de TODOS los vendedores
  const obtenerHorariosVendedores = () => {
    if (vendedoresInfo.length === 0) {
      return [{ inicio: "10:00", fin: "15:00" }];
    }
    return vendedoresInfo.map(v => v.horario || { inicio: "10:00", fin: "15:00" });
  };

  // Calcular la intersección de horarios (rango válido para TODOS los vendedores)
  const calcularHorarioComun = () => {
    const horarios = obtenerHorariosVendedores();
    
    // Si solo hay un vendedor, usar su horario
    if (horarios.length === 1) {
      return horarios[0];
    }
    
    // Encontrar la hora de inicio más tardía (máximo de todos los inicios)
    const inicioComun = horarios.reduce((max, h) => h.inicio > max ? h.inicio : max, horarios[0].inicio);
    
    // Encontrar la hora de fin más temprana (mínimo de todos los fines)
    const finComun = horarios.reduce((min, h) => h.fin < min ? h.fin : min, horarios[0].fin);
    
    // Si no hay intersección (inicio >= fin), retornar null
    if (inicioComun >= finComun) {
      return null;
    }
    
    return { inicio: inicioComun, fin: finComun };
  };

  const horarioLaboral = calcularHorarioComun();
  const todosLosHorarios = obtenerHorariosVendedores();
  const multipleVendedores = vendedoresInfo.length > 1;

  // Validar hora seleccionada (formato 24 horas: HH:mm)
  const validarHora = (hora: string): boolean => {
    if (!hora) {
      setErrorHora("Por favor selecciona una hora de entrega");
      return false;
    }

    // Verificar si hay horarios incompatibles
    if (!horarioLaboral) {
      setErrorHora(
        "Los vendedores tienen horarios incompatibles. No hay un horario común disponible. Por favor, realiza pedidos separados."
      );
      return false;
    }

    // Validar que sea posterior a la hora actual
    // Usamos formato 24 horas: 00:00 - 23:59
    const ahora = new Date();
    const horaActual = `${ahora.getHours().toString().padStart(2, "0")}:${ahora
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    if (hora <= horaActual) {
      setErrorHora("Selecciona una hora posterior a la hora actual.");
      return false;
    }

    // Validar que esté dentro del horario laboral común
    const horaCruzaMedianoche = horarioLaboral.fin < horarioLaboral.inicio;
    
    if (horaCruzaMedianoche) {
      // Si el horario cruza medianoche (ej: 17:00 a 02:00)
      if (hora < horarioLaboral.inicio && hora > horarioLaboral.fin) {
        setErrorHora(
          multipleVendedores
            ? `La hora debe estar entre ${horarioLaboral.inicio} y ${horarioLaboral.fin} (horario común de todos los vendedores).`
            : `La hora seleccionada está fuera del horario laboral del cocinero (${horarioLaboral.inicio} — ${horarioLaboral.fin}).`
        );
        return false;
      }
    } else {
      // Horario normal (ej: 10:00 a 15:00)
      if (hora < horarioLaboral.inicio || hora > horarioLaboral.fin) {
        setErrorHora(
          multipleVendedores
            ? `La hora debe estar entre ${horarioLaboral.inicio} y ${horarioLaboral.fin} (horario común de todos los vendedores).`
            : `La hora seleccionada está fuera del horario laboral del cocinero (${horarioLaboral.inicio} — ${horarioLaboral.fin}).`
        );
        return false;
      }
    }

    setErrorHora("");
    return true;
  };

  const handleAplicarCodigo = async () => {
    if (!codigoTemporal.trim()) {
      setMensajeDescuento("");
      return;
    }

    setAplicandoCodigo(true);
    setMensajeDescuento("");

    try {
      // El código se validará en CartSidebar cuando se confirme el pedido
      setCodigoPromocional(codigoTemporal.trim());
      setMensajeDescuento(
        "Código ingresado. Se validará al confirmar el pedido."
      );
    } finally {
      setAplicandoCodigo(false);
    }
  };

  const handleConfirmar = async () => {
    if (!validarHora(horaEntrega)) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm({
        notas: notas.trim() || undefined,
        horaEntrega,
        codigoPromocional: codigoPromocional.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  // Limpiar formulario cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setNotas("");
      setHoraEntrega("");
      setCodigoPromocional("");
      setCodigoTemporal("");
      setErrorHora("");
      setMensajeDescuento("");
    }
  }, [isOpen]);

  // Mostrar error si no hay horario común disponible
  useEffect(() => {
    if (isOpen && !horarioLaboral && vendedoresInfo.length > 1) {
      setErrorHora(
        "Los vendedores tienen horarios incompatibles. Por favor, realiza pedidos separados."
      );
    }
  }, [isOpen, horarioLaboral, vendedoresInfo.length]);

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

          {/* Método de entrega - FIJO */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              📍 Método de entrega
            </label>
            <div className="rounded-lg p-3 border-2 border-primary-200 bg-primary-50">
              <div className="flex gap-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-base bg-primary-600">
                    📍
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1 text-primary-900">
                    Recoger en la puerta principal de la Universidad Tecnológica del Norte de Aguascalientes (UTNA).
                  </h3>
                  <div className="mt-2 px-2 py-1 bg-primary-600 text-white text-xs rounded-md inline-block">
                    Entrega únicamente en la puerta principal de la UTNA. Los pagos son solo en efectivo.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selección de hora */}
          <div className="space-y-2">
            <label
              htmlFor="hora"
              className="block text-sm font-semibold text-gray-700"
            >
              🕐 Hora de entrega
            </label>
            <input
              id="hora"
              type="time"
              value={horaEntrega}
              step="60"
              onChange={(e) => {
                setHoraEntrega(e.target.value);
                if (errorHora) {
                  validarHora(e.target.value);
                }
              }}
              onBlur={(e) => validarHora(e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                errorHora
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary-500"
              } ${!horarioLaboral ? "bg-gray-100 cursor-not-allowed" : ""}`}
              disabled={loading || !horarioLaboral}
              required
              // Formato 24 horas (HH:mm) - Nativo en HTML5
            />
            {errorHora && (
              <p className="text-xs text-red-600 flex items-start gap-1">
                <span className="text-sm">⚠️</span>
                <span>{errorHora}</span>
              </p>
            )}
            {/* Información de horarios */}
            {!horarioLaboral ? (
              // Horarios incompatibles
              <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                <p className="text-xs text-red-800 font-semibold mb-2">
                  ⚠️ Horarios Incompatibles
                </p>
                <p className="text-xs text-red-700 mb-2">
                  Tu carrito tiene productos de vendedores con horarios que no se superponen:
                </p>
                {todosLosHorarios.map((horario, idx) => (
                  <p key={idx} className="text-xs text-red-700">
                    • Vendedor {idx + 1}: {horario.inicio} — {horario.fin}
                  </p>
                ))}
                <p className="text-xs text-red-800 font-semibold mt-2">
                  Por favor, realiza pedidos separados o contacta a los vendedores.
                </p>
              </div>
            ) : multipleVendedores ? (
              // Múltiples vendedores con horario común
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                <p className="text-xs text-amber-900 font-semibold mb-1">
                  ⚠️ Pedido con múltiples vendedores
                </p>
                <p className="text-xs text-amber-800 mb-2">
                  Tu pedido incluye productos de {vendedoresInfo.length} vendedores diferentes.
                </p>
                <p className="text-xs text-amber-900 font-semibold">
                  Horario común disponible: {horarioLaboral.inicio} — {horarioLaboral.fin}
                </p>
                <details className="mt-2">
                  <summary className="text-xs text-amber-700 cursor-pointer hover:text-amber-900">
                    Ver horarios individuales
                  </summary>
                  <div className="mt-2 space-y-1">
                    {todosLosHorarios.map((horario, idx) => (
                      <p key={idx} className="text-xs text-amber-700">
                        • Vendedor {idx + 1}: {horario.inicio} — {horario.fin}
                      </p>
                    ))}
                  </div>
                </details>
              </div>
            ) : (
              // Un solo vendedor
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <p className="text-xs text-blue-800">
                  <strong>Horario del cocinero:</strong> {horarioLaboral.inicio}{" "}
                  — {horarioLaboral.fin}
                </p>
              </div>
            )}
          </div>

          {/* Código promocional con botón Aplicar */}
          <div className="space-y-2">
            <label
              htmlFor="codigo"
              className="block text-sm font-semibold text-gray-700"
            >
              🎁 Código promocional (opcional)
            </label>
            <div className="flex gap-2">
              <input
                id="codigo"
                type="text"
                value={codigoTemporal}
                onChange={(e) => {
                  setCodigoTemporal(e.target.value.toUpperCase());
                  setMensajeDescuento("");
                }}
                placeholder="Ej: PROMO10"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 uppercase"
                disabled={loading || aplicandoCodigo}
              />
              <button
                type="button"
                onClick={handleAplicarCodigo}
                disabled={
                  loading || aplicandoCodigo || !codigoTemporal.trim()
                }
                className="px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aplicandoCodigo ? "..." : "Aplicar"}
              </button>
            </div>
            {mensajeDescuento && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span>✓</span>
                <span>{mensajeDescuento}</span>
              </p>
            )}
            <p className="text-[10px] text-gray-500">
              Si tienes un código, ingrésalo y haz clic en "Aplicar"
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
            disabled={loading || !horaEntrega || !horarioLaboral}
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
