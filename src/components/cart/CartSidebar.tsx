"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/components/context/AlertContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/utils/formatters";
import ConfirmarPedidoModal from "./ConfirmarPedidoModal";
import {
  crearPedido,
  validarDisponibilidadPlatillos,
} from "@/services/pedidos/pedidoService";

export default function CartSidebar() {
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    isCartOpen,
    closeCart,
    clearCart,
  } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar items con cantidad > 0 para mostrar solo los que realmente están en el carrito
  const validItems = items.filter((item) => {
    // Validar que el item tenga estructura correcta y cantidad > 0
    const isValid =
      item &&
      item.platillo &&
      item.platillo.id &&
      typeof item.cantidad === "number" &&
      item.cantidad > 0 &&
      item.cantidad < 1000; // Límite razonable

    if (!isValid && item) {
      console.warn("⚠️ Item inválido filtrado:", {
        item,
        tienePlatillo: !!item.platillo,
        tieneId: !!item.platillo?.id,
        cantidad: item.cantidad,
        tipoCantidad: typeof item.cantidad,
      });
    }

    return isValid;
  });

  // Debug: Log para ver qué está pasando
  useEffect(() => {
    if (isCartOpen) {
      console.log("🛒 CartSidebar - Carrito abierto");
      console.log("🛒 CartSidebar - Items en carrito:", items.length);
      console.log("🛒 CartSidebar - Items válidos:", validItems.length);
      console.log(
        "🛒 CartSidebar - Items detalle:",
        JSON.stringify(items, null, 2)
      );
      console.log(
        "🛒 CartSidebar - ValidItems detalle:",
        JSON.stringify(validItems, null, 2)
      );

      // Verificar cada item individualmente
      items.forEach((item, index) => {
        console.log(`🛒 Item ${index}:`, {
          tienePlatillo: !!item.platillo,
          platilloId: item.platillo?.id,
          platilloNombre: item.platillo?.nombre,
          cantidad: item.cantidad,
          cantidadEsNumero: typeof item.cantidad === "number",
          cantidadMayorACero: item.cantidad > 0,
          esValido:
            item &&
            item.platillo &&
            typeof item.cantidad === "number" &&
            item.cantidad > 0,
        });
      });
    }
  }, [items, isCartOpen, validItems]);

  const handleCheckout = () => {
    if (!user) {
      showAlert("Debes iniciar sesión para continuar con el pedido", "info");
      closeCart();
      router.push("/vendedor/login");
      return;
    }
    // Abrir el modal de confirmación
    setIsModalOpen(true);
  };

  const handleConfirmarPedido = async (
    tipoEntrega: "recoger" | "entrega",
    direccion?: string,
    notas?: string
  ) => {
    if (!user) {
      showAlert("Debes iniciar sesión para continuar", "error");
      return;
    }

    try {
      // 1. Validar disponibilidad de platillos
      console.log("🔍 Validando disponibilidad de platillos...");
      const validacion = await validarDisponibilidadPlatillos(validItems);

      if (!validacion.valido) {
        showAlert(
          validacion.mensaje || "Algunos platillos ya no están disponibles",
          "error"
        );
        setIsModalOpen(false);
        return;
      }

      // 2. Crear el pedido
      console.log("💾 Creando pedido...");
      const pedidosCreados = await crearPedido({
        estudianteId: user.uid,
        items: validItems,
        tipoEntrega,
        direccionEntrega: direccion,
        notas,
      });

      console.log("✅ Pedidos creados:", pedidosCreados);

      // 3. Mostrar mensaje de éxito
      const cantidadVendedores = pedidosCreados.length;
      const mensaje =
        cantidadVendedores === 1
          ? "¡Pedido confirmado exitosamente! El vendedor fue notificado."
          : `¡Pedidos confirmados exitosamente! Se crearon ${cantidadVendedores} pedidos (uno por vendedor).`;

      showAlert(mensaje, "success");

      // 4. Limpiar carrito y cerrar todo
      clearCart();
      setIsModalOpen(false);
      closeCart();
    } catch (error) {
      console.error("❌ Error al crear pedido:", error);
      showAlert(
        error instanceof Error
          ? error.message
          : "No se pudo crear el pedido. Intenta de nuevo.",
        "error"
      );
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-[90vw] sm:w-96 max-w-md bg-white shadow-large z-[9999] flex flex-col border-l border-gray-200 animate-slide-in-right overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        style={{ isolation: "isolate" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 font-display">
            Carrito de Compras
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all duration-200"
            aria-label="Cerrar carrito"
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

        {/* Items List */}
        <div
          className="flex-1 overflow-y-auto p-3 sm:p-4"
          style={{ isolation: "isolate" }}
        >
          {validItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mb-3 sm:mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-gray-700 text-sm sm:text-base font-semibold mb-1.5">
                Tu carrito está vacío
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                Agrega productos del menú
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {validItems.map((item) => (
                <div
                  key={item.platillo.id}
                  className="flex gap-2 sm:gap-3 p-2.5 sm:p-3 border border-gray-200 rounded-lg hover:shadow-soft transition-all duration-200 bg-white"
                >
                  {/* Imagen */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    {item.platillo.imagen &&
                    item.platillo.imagen.startsWith("http") ? (
                      <img
                        src={item.platillo.imagen}
                        alt={item.platillo.nombre}
                        className="w-full h-full object-cover object-center"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base sm:text-lg">
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate mb-1 text-sm">
                      {item.platillo.nombre}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">
                      {formatPrice(item.platillo.precio)} c/u
                    </p>

                    {/* Controles de cantidad */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.platillo.id, item.cantidad - 1)
                          }
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-primary-500 transition-all duration-200"
                          aria-label="Disminuir cantidad"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-800 text-sm">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.platillo.id, item.cantidad + 1)
                          }
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-primary-500 transition-all duration-200"
                          aria-label="Aumentar cantidad"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.platillo.id)}
                        className="text-error-500 hover:text-error-600 p-1.5 rounded-lg hover:bg-error-50 transition-all duration-200"
                        aria-label="Eliminar producto"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-bold text-primary-500 text-sm sm:text-base">
                      {formatPrice(item.platillo.precio * item.cantidad)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botones */}
        {validItems.length > 0 && (
          <div className="border-t border-gray-200 p-3 sm:p-4 space-y-3 bg-gray-50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base font-semibold text-gray-800">
                Total:
              </span>
              <span className="text-lg sm:text-xl font-bold text-primary-500">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:border-gray-400 transition-all duration-200 font-medium text-sm"
              >
                Vaciar Carrito
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 btn-primary text-center shadow-medium hover:shadow-large"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <ConfirmarPedidoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmarPedido}
        totalItems={getTotalItems()}
        totalPrice={formatPrice(getTotalPrice())}
      />
    </>
  );
}
