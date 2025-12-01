'use client';

import { useCart } from '@/components/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/components/context/AlertContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartSidebar() {
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    isCartOpen,
    closeCart,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    if (!user) {
      showAlert('Debes iniciar sesión para continuar con el pedido', 'info');
      closeCart();
      router.push('/vendedor/login');
      return;
    }
    showAlert('Tu pago fue exitoso', 'success');
    clearCart();
    closeCart();
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-[#454545]">Carrito de Compras</h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar carrito"
          >
            <svg
              className="w-6 h-6"
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
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-24 h-24 text-gray-300 mb-4"
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
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-2">
                Agrega productos del menú
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.platillo.id}
                  className="flex gap-4 p-3 border rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.platillo.imagen &&
                    item.platillo.imagen.startsWith('http') ? (
                      <img
                        src={item.platillo.imagen}
                        alt={item.platillo.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#454545] truncate">
                      {item.platillo.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ${item.platillo.precio.toFixed(2)} c/u
                    </p>
                    
                    {/* Controles de cantidad */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.platillo.id, item.cantidad - 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          aria-label="Disminuir cantidad"
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
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.platillo.id, item.cantidad + 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          aria-label="Aumentar cantidad"
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
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.platillo.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Eliminar producto"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-bold text-[#fbaf32]">
                      ${(item.platillo.precio * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botones */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-[#454545]">Total:</span>
              <span className="text-2xl font-bold text-[#fbaf32]">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Vaciar Carrito
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 btn-primary text-center"
              >
                Pagar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

