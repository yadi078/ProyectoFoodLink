"use client";

import { useState, useEffect } from "react";

interface ConfirmarPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    notas?: string;
    horaEntrega: string;
    codigoPromocional?: string;
    descuentoCalculado?: number;
    promocionId?: string;
  }) => void;
  totalItems: number;
  totalPrice: string;
  totalPriceNumber: number; // Agregar total como número
  userId: string; // Agregar userId para validar cupón
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
  totalPriceNumber,
  userId,
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
  const [descuentoCalculado, setDescuentoCalculado] = useState(0);
  const [promocionIdTemp, setPromocionIdTemp] = useState<string | undefined>();

  // Horarios fijos disponibles
  const HORARIOS_FIJOS = [
    { valor: "10:20", etiqueta: "10:20 AM" },
    { valor: "12:20", etiqueta: "12:20 PM" },
    { valor: "18:15", etiqueta: "6:15 PM" },
  ];

  // Obtener horarios de TODOS los vendedores
  const obtenerHorariosVendedores = () => {
    if (vendedoresInfo.length === 0) {
      return [{ inicio: "10:00", fin: "15:00" }];
    }
    return vendedoresInfo.map(
      (v) => v.horario || { inicio: "10:00", fin: "15:00" }
    );
  };

  const todosLosHorarios = obtenerHorariosVendedores();
  const multipleVendedores = vendedoresInfo.length > 1;

  // Validar hora seleccionada (debe ser uno de los 3 horarios fijos)
  const validarHora = (hora: string): boolean => {
    if (!hora) {
      setErrorHora("Por favor selecciona un horario de entrega");
      return false;
    }

    // Validar que sea uno de los horarios fijos
    const esHorarioValido = HORARIOS_FIJOS.some((h) => h.valor === hora);
    if (!esHorarioValido) {
      setErrorHora("Por favor selecciona un horario válido");
      return false;
    }

    // Validar que todos los vendedores estén disponibles en ese horario
    const vendedoresFueraDeHorario: string[] = [];

    vendedoresInfo.forEach((vendedorInfo, index) => {
      const horario = vendedorInfo.horario || { inicio: "10:00", fin: "15:00" };
      const horaCruzaMedianoche = horario.fin < horario.inicio;

      let estaDisponible = false;

      if (horaCruzaMedianoche) {
        // Si el horario cruza medianoche (ej: 17:00 a 02:00)
        estaDisponible = hora >= horario.inicio || hora <= horario.fin;
      } else {
        // Horario normal (ej: 10:00 a 15:00)
        estaDisponible = hora >= horario.inicio && hora <= horario.fin;
      }

      if (!estaDisponible) {
        vendedoresFueraDeHorario.push(
          `Vendedor ${index + 1} (horario: ${horario.inicio} - ${horario.fin})`
        );
      }
    });

    if (vendedoresFueraDeHorario.length > 0) {
      if (
        vendedoresFueraDeHorario.length === 1 &&
        vendedoresInfo.length === 1
      ) {
        const horario = vendedoresInfo[0].horario || {
          inicio: "10:00",
          fin: "15:00",
        };
        const nombreVendedor = vendedoresInfo[0].vendedorId; // Podríamos pasar el nombre también
        setErrorHora(
          `"${nombreVendedor}" está fuera de su horario laboral. Horario disponible: ${horario.inicio} - ${horario.fin}`
        );
      } else {
        setErrorHora(
          `Los siguientes vendedores están fuera de su horario laboral a las ${hora}:\n${vendedoresFueraDeHorario.join(
            ", "
          )}`
        );
      }
      return false;
    }

    setErrorHora("");
    return true;
  };

  const handleAplicarCodigo = async () => {
    if (!codigoTemporal.trim()) {
      setMensajeDescuento("");
      setDescuentoCalculado(0);
      setPromocionIdTemp(undefined);
      return;
    }

    setAplicandoCodigo(true);
    setMensajeDescuento("");

    try {
      // Importar dinámicamente para evitar problemas en build
      const { validarPromocion } = await import("@/services/promociones/promocionService");
      
      const resultado = await validarPromocion(
        codigoTemporal.trim(),
        userId,
        totalPriceNumber
      );

      if (resultado.valido && resultado.descuento) {
        setCodigoPromocional(codigoTemporal.trim());
        setDescuentoCalculado(resultado.descuento);
        setPromocionIdTemp(resultado.promocion?.id);
        
        const descuentoTexto = resultado.promocion?.tipo === "porcentaje"
          ? `${resultado.promocion.valor}%`
          : `$${resultado.promocion?.valor}`;
        
        setMensajeDescuento(
          `¡Código válido! Descuento de ${descuentoTexto} aplicado (${formatPrice(resultado.descuento)})`
        );
      } else {
        setMensajeDescuento(resultado.mensaje || "Código no válido");
        setDescuentoCalculado(0);
        setPromocionIdTemp(undefined);
        setCodigoPromocional("");
      }
    } catch (error) {
      console.error("Error validando código:", error);
      setMensajeDescuento("Error al validar el código");
      setDescuentoCalculado(0);
      setPromocionIdTemp(undefined);
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
        descuentoCalculado: descuentoCalculado > 0 ? descuentoCalculado : undefined,
        promocionId: promocionIdTemp,
      });
    } finally {
      setLoading(false);
    }
  };

  // Importar formatPrice
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
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
      setDescuentoCalculado(0);
      setPromocionIdTemp(undefined);
    }
  }, [isOpen]);

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
            {descuentoCalculado > 0 && (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    Subtotal:
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {totalPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2 text-green-600">
                  <span className="text-xs sm:text-sm font-semibold">Descuento:</span>
                  <span className="font-semibold text-sm">
                    -{formatPrice(descuentoCalculado)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm font-semibold">
                Total a pagar:
              </span>
              <span className="font-bold text-primary-500 text-base sm:text-lg">
                {descuentoCalculado > 0 
                  ? formatPrice(totalPriceNumber - descuentoCalculado)
                  : totalPrice}
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
                    Recoger en la puerta principal de la Universidad Tecnológica
                    del Norte de Aguascalientes (UTNA).
                  </h3>
                  <div className="mt-2 px-2 py-1 bg-primary-600 text-white text-xs rounded-md inline-block">
                    Entrega únicamente en la puerta principal de la UTNA. Los
                    pagos son solo en efectivo.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selección de hora - Select simple */}
          <div className="space-y-2">
            <label htmlFor="horaEntrega" className="block text-sm font-semibold text-gray-700">
              🕐 Hora de entrega
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Selecciona uno de los horarios disponibles:
            </p>
            <select
              id="horaEntrega"
              value={horaEntrega}
              onChange={(e) => {
                setHoraEntrega(e.target.value);
                validarHora(e.target.value);
              }}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 font-medium transition-all duration-200 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="" disabled>
                Selecciona un horario
              </option>
              {HORARIOS_FIJOS.map((horario) => (
                <option key={horario.valor} value={horario.valor}>
                  {horario.etiqueta}
                </option>
              ))}
            </select>
            {errorHora && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 mt-2">
                <p className="text-xs text-red-600 flex items-start gap-1">
                  <span className="text-sm">⚠️</span>
                  <span>{errorHora}</span>
                </p>
              </div>
            )}
            {/* Información de horarios de vendedores */}
            {multipleVendedores && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mt-2">
                <p className="text-xs text-amber-900 font-semibold mb-1">
                  ⚠️ Pedido con múltiples vendedores
                </p>
                <p className="text-xs text-amber-800 mb-2">
                  Tu pedido incluye productos de {vendedoresInfo.length}{" "}
                  vendedores diferentes.
                </p>
                <details className="mt-2">
                  <summary className="text-xs text-amber-700 cursor-pointer hover:text-amber-900">
                    Ver horarios de los vendedores
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
            )}
            {!multipleVendedores && vendedoresInfo.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                <p className="text-xs text-blue-800">
                  <strong>Horario del cocinero:</strong>{" "}
                  {todosLosHorarios[0]?.inicio || "10:00"} —{" "}
                  {todosLosHorarios[0]?.fin || "15:00"}
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
                disabled={loading || aplicandoCodigo || !codigoTemporal.trim()}
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
            disabled={loading || !horaEntrega}
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
