"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useAlert } from "@/components/context/AlertContext";
import { getPlatillosDisponibles } from "@/services/menus/menuService";
import { getVendedorConCalificacion } from "@/services/vendedores/vendedorService";
import type { Platillo } from "@/lib/firebase/types";
import type { Vendedor } from "@/lib/firebase/types";

interface PlatilloConVendedor extends Platillo {
  vendedorNombre?: string;
  vendedorCalificacion?: number;
}

export default function MenuPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [filtro, setFiltro] = useState("");
  const [tipoComida, setTipoComida] = useState("todos");
  const [platillos, setPlatillos] = useState<PlatilloConVendedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPlatillos = async () => {
      setLoading(true);
      try {
        console.log("Iniciando carga de platillos...");
        const platillosData = await getPlatillosDisponibles();
        console.log("Platillos obtenidos:", platillosData.length);

        if (platillosData.length === 0) {
          console.log("No se encontraron platillos disponibles");
          setPlatillos([]);
          setLoading(false);
          return;
        }

        // Obtener información de vendedores para cada platillo (no crítico, puede fallar)
        console.log("Obteniendo información de vendedores...");
        const platillosConVendedor = await Promise.all(
          platillosData.map(async (platillo) => {
            try {
              // Intentar obtener info del vendedor con calificación, pero no fallar si no hay autenticación
              const vendedor = await getVendedorConCalificacion(
                platillo.vendedorId
              );
              return {
                ...platillo,
                vendedorNombre: vendedor?.nombre || "Vendedor",
                vendedorCalificacion: vendedor?.calificacion || 0,
              };
            } catch (error) {
              // Si falla (por falta de autenticación u otro error), usar valores por defecto
              console.log(
                "No se pudo obtener info del vendedor para:",
                platillo.id
              );
              return {
                ...platillo,
                vendedorNombre: "Vendedor",
                vendedorCalificacion: 0,
              };
            }
          })
        );

        console.log(
          "Platillos con información de vendedores:",
          platillosConVendedor.length
        );
        setPlatillos(platillosConVendedor);
      } catch (error: any) {
        console.error("Error cargando platillos:", error);
        console.error("Detalles del error:", {
          code: error.code,
          message: error.message,
          stack: error.stack,
        });
        // No mostrar error crítico, solo mostrar lista vacía
        setPlatillos([]);
        if (error.message && !error.message.includes("permission")) {
          showAlert(
            "Error al cargar los menús. Por favor, intenta de nuevo.",
            "error"
          );
        }
      } finally {
        setLoading(false);
        console.log("Carga de platillos finalizada");
      }
    };

    cargarPlatillos();
  }, [showAlert]);

  const menusFiltrados = platillos.filter((menu) => {
    const coincideNombre = menu.nombre
      .toLowerCase()
      .includes(filtro.toLowerCase());
    const coincideDisponible =
      tipoComida === "todos" ||
      (tipoComida === "disponible" && menu.disponible) ||
      (tipoComida === "agotado" && !menu.disponible);
    return coincideNombre && coincideDisponible;
  });

  const handlePedido = (menuId: string, disponible: boolean) => {
    if (!disponible) {
      showAlert("Este menú no está disponible en este momento", "warning");
      return;
    }

    if (!user) {
      showAlert("Debes iniciar sesión para hacer un pedido", "info");
      router.push("/vendedor/login");
      return;
    }

    router.push(`/estudiante/pedido/${menuId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando menús...</p>
          <p className="mt-2 text-sm text-gray-400">Por favor espera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🍽️ Menú Disponible
          </h1>
          <p className="text-gray-600">
            Explora los platillos disponibles de nuestros cocineros locales
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                💡 <strong>Nota:</strong> Necesitas{" "}
                <Link
                  href="/vendedor/login"
                  className="underline font-semibold"
                >
                  iniciar sesión
                </Link>{" "}
                o{" "}
                <Link
                  href="/vendedor/signup"
                  className="underline font-semibold"
                >
                  registrarte
                </Link>{" "}
                para hacer pedidos
              </p>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nombre
              </label>
              <input
                type="text"
                placeholder="Buscar platillos..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por disponibilidad
              </label>
              <select
                value={tipoComida}
                onChange={(e) => setTipoComida(e.target.value)}
                className="form-input w-full"
              >
                <option value="todos">Todos</option>
                <option value="disponible">Disponibles</option>
                <option value="agotado">Agotados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Menús */}
        {menusFiltrados.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {menusFiltrados.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border-2 border-transparent hover:border-primary-300"
              >
                <div className="p-4 sm:p-6">
                  <div className="text-5xl sm:text-6xl text-center mb-3 sm:mb-4">
                    {menu.imagen || "🍽️"}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {menu.nombre}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
                    {menu.descripcion}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-primary-500">
                        €{menu.precio.toFixed(2)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {menu.vendedorNombre || "Vendedor"}
                      </p>
                    </div>
                    <div className="text-right">
                      {menu.vendedorCalificacion &&
                        menu.vendedorCalificacion > 0 && (
                          <div className="flex items-center text-yellow-500">
                            <span className="text-sm sm:text-base">⭐</span>
                            <span className="ml-1 text-xs sm:text-sm font-semibold">
                              {menu.vendedorCalificacion.toFixed(1)}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/estudiante/vendedor/${menu.vendedorId}`}
                      className="btn-outline flex-1 text-center text-xs sm:text-sm py-2"
                    >
                      Ver Detalles
                    </Link>
                    <button
                      onClick={() => handlePedido(menu.id, menu.disponible)}
                      disabled={!menu.disponible}
                      className={`btn-primary flex-1 text-xs sm:text-sm py-2 ${
                        !menu.disponible ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {menu.disponible ? "Pedir Ahora" : "Agotado"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            {platillos.length === 0 ? (
              <>
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-gray-600 text-lg mb-4">
                  No hay menús disponibles en este momento
                </p>
                <p className="text-gray-500 mb-4">
                  Los cocineros están preparando nuevos platillos. ¡Vuelve
                  pronto!
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  💡 Tip: Si eres vendedor, inicia sesión para agregar tus
                  platillos al menú.
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg mb-2">
                  No se encontraron menús con los filtros seleccionados.
                </p>
                <button
                  onClick={() => {
                    setFiltro("");
                    setTipoComida("todos");
                  }}
                  className="mt-4 btn-primary"
                >
                  Limpiar Filtros
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
