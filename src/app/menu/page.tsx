"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useAlert } from "@/components/context/AlertContext";
import { useCart } from "@/components/context/CartContext";
import { getPlatillosDisponibles } from "@/services/menus/menuService";
import { getVendedorConCalificacion } from "@/services/vendedores/vendedorService";
import {
  getCalificacionesByPlatillo,
  getPromedioCalificacion,
  crearCalificacionProducto,
  type CalificacionProducto,
} from "@/services/platillos/calificacionService";
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
  const { addItem, openCart } = useCart();
  const [filtro, setFiltro] = useState("");
  const [tipoComida, setTipoComida] = useState("todos");
  const [platillos, setPlatillos] = useState<PlatilloConVendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<PlatilloConVendedor | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [calificaciones, setCalificaciones] = useState<CalificacionProducto[]>(
    []
  );
  const [promedioCalificacion, setPromedioCalificacion] = useState({
    promedio: 0,
    total: 0,
  });
  const [mostrarFormularioResena, setMostrarFormularioResena] = useState(false);
  const [calificacionForm, setCalificacionForm] = useState({
    calificacion: 5,
    comentario: "",
  });
  const [cargandoResena, setCargandoResena] = useState(false);

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

  const handlePedido = (platillo: Platillo, disponible: boolean) => {
    if (!disponible) {
      showAlert("Este menú no está disponible en este momento", "warning");
      return;
    }

    // Agregar al carrito
    addItem(platillo, 1);
    showAlert(`${platillo.nombre} agregado al carrito`, "success");
    openCart();
  };

  const abrirModalDetalles = async (platillo: PlatilloConVendedor) => {
    console.log(
      "🔍 Abriendo modal para platillo:",
      platillo.id,
      platillo.nombre
    );
    setProductoSeleccionado(platillo);
    setMostrarModal(true);
    setMostrarFormularioResena(false);
    setCalificaciones([]);
    setPromedioCalificacion({ promedio: 0, total: 0 });

    // Cargar calificaciones
    try {
      console.log("📥 Cargando calificaciones para platillo:", platillo.id);
      const [calificacionesData, promedioData] = await Promise.all([
        getCalificacionesByPlatillo(platillo.id),
        getPromedioCalificacion(platillo.id),
      ]);
      console.log("✅ Calificaciones cargadas:", calificacionesData.length);
      console.log("✅ Promedio calculado:", promedioData);
      setCalificaciones(calificacionesData);
      setPromedioCalificacion(promedioData);
    } catch (error: any) {
      console.error("❌ Error cargando calificaciones:", error);
      console.error("Detalles del error:", {
        code: error.code,
        message: error.message,
      });
      setCalificaciones([]);
      setPromedioCalificacion({ promedio: 0, total: 0 });
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
    setCalificaciones([]);
    setMostrarFormularioResena(false);
    setCalificacionForm({ calificacion: 5, comentario: "" });
  };

  const handleEnviarResena = async () => {
    if (!user || !productoSeleccionado) {
      showAlert("Debes iniciar sesión para dejar una reseña", "warning");
      return;
    }

    if (
      calificacionForm.calificacion < 1 ||
      calificacionForm.calificacion > 5
    ) {
      showAlert("La calificación debe estar entre 1 y 5", "warning");
      return;
    }

    setCargandoResena(true);
    try {
      // Obtener nombre del estudiante
      let nombreEstudiante = "Usuario";
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase/config");
        const estudianteDoc = await getDoc(doc(db, "estudiantes", user.uid));
        if (estudianteDoc.exists()) {
          nombreEstudiante =
            estudianteDoc.data().nombre ||
            user.displayName ||
            user.email?.split("@")[0] ||
            "Usuario";
        } else {
          nombreEstudiante =
            user.displayName || user.email?.split("@")[0] || "Usuario";
        }
      } catch (error) {
        console.log(
          "No se pudo obtener nombre del estudiante, usando email:",
          error
        );
        nombreEstudiante =
          user.displayName || user.email?.split("@")[0] || "Usuario";
      }

      console.log("Enviando reseña con datos:", {
        estudianteId: user.uid,
        platilloId: productoSeleccionado.id,
        vendedorId: productoSeleccionado.vendedorId,
        calificacion: calificacionForm.calificacion,
        comentario: calificacionForm.comentario.trim(),
        estudianteNombre: nombreEstudiante,
      });

      const calificacionId = await crearCalificacionProducto({
        estudianteId: user.uid,
        platilloId: productoSeleccionado.id,
        vendedorId: productoSeleccionado.vendedorId,
        calificacion: calificacionForm.calificacion,
        comentario: calificacionForm.comentario.trim() || undefined,
        estudianteNombre: nombreEstudiante,
      });

      console.log("✅ Reseña creada con ID:", calificacionId);

      showAlert("¡Reseña enviada exitosamente!", "success");

      // Esperar un momento antes de recargar para asegurar que Firestore haya actualizado
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Recargar calificaciones
      console.log(
        "Recargando calificaciones para platillo:",
        productoSeleccionado.id
      );
      const [calificacionesData, promedioData] = await Promise.all([
        getCalificacionesByPlatillo(productoSeleccionado.id),
        getPromedioCalificacion(productoSeleccionado.id),
      ]);

      console.log("Calificaciones recargadas:", calificacionesData.length);
      console.log("Promedio:", promedioData);

      setCalificaciones(calificacionesData);
      setPromedioCalificacion(promedioData);

      setMostrarFormularioResena(false);
      setCalificacionForm({ calificacion: 5, comentario: "" });
    } catch (error: any) {
      console.error("Error enviando reseña:", error);
      console.error("Detalles del error:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      showAlert(
        `Error al enviar la reseña: ${error.message || "Intenta de nuevo"}`,
        "error"
      );
    } finally {
      setCargandoResena(false);
    }
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
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#fbaf32] mb-2 font-display flex items-center gap-3">
            <span>🍽️</span>
            <span>Menú Disponible</span>
          </h1>
          <p className="text-[#757575]">
            Explora los platillos disponibles de nuestros cocineros locales
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-[rgba(0,0,0,0.04)] border border-[#fbaf32] rounded-lg">
              <p className="text-[#454545] text-sm">
                💡 <strong>Nota:</strong> Necesitas{" "}
                <Link
                  href="/vendedor/login"
                  className="text-[#719a0a] hover:text-[#fbaf32] underline font-semibold transition-colors"
                >
                  iniciar sesión
                </Link>{" "}
                o{" "}
                <Link
                  href="/vendedor/signup"
                  className="text-[#719a0a] hover:text-[#fbaf32] underline font-semibold transition-colors"
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
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Imagen del Producto con icono del ojito */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  {menu.imagen &&
                  menu.imagen.trim() &&
                  (menu.imagen.startsWith("http://") ||
                    menu.imagen.startsWith("https://")) &&
                  menu.imagen.length > 10 ? (
                    <>
                      <img
                        src={menu.imagen}
                        alt={menu.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector(
                              ".image-fallback"
                            ) as HTMLElement;
                            if (fallback) {
                              fallback.style.display = "flex";
                            }
                          }
                        }}
                      />
                      <div className="image-fallback hidden w-full h-full absolute inset-0 flex items-center justify-center text-gray-400">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-6xl">🍽️</span>
                    </div>
                  )}
                  {/* Icono del ojito para ver detalles */}
                  <button
                    onClick={() => abrirModalDetalles(menu)}
                    className="absolute top-3 left-3 w-10 h-10 bg-[#2d5016] rounded-full flex items-center justify-center hover:bg-[#3a6a1d] transition-colors shadow-lg z-10"
                    aria-label="Ver detalles"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Información del producto */}
                <div className="p-5 bg-[#f5f5dc]">
                  <h3 className="text-xl font-bold text-[#3a3a3a] mb-2">
                    {menu.nombre}
                  </h3>

                  {/* Calificación del vendedor */}
                  {menu.vendedorCalificacion &&
                    menu.vendedorCalificacion > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <=
                                Math.round(menu.vendedorCalificacion || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-[#3a3a3a]">
                          {menu.vendedorCalificacion.toFixed(1)}
                        </span>
                      </div>
                    )}

                  <p className="text-sm text-[#3a3a3a] mb-3 line-clamp-2">
                    {menu.descripcion}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-[#fbaf32]">
                      ${menu.precio.toFixed(2)}
                    </p>
                    {menu.cantidadDisponible !== undefined && (
                      <p className="text-xs text-[#757575]">
                        Disponibles: {menu.cantidadDisponible}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handlePedido(menu, menu.disponible)}
                    disabled={!menu.disponible}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                      menu.disponible
                        ? "bg-[#fbaf32] hover:bg-[#e69d1f]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span>+</span>
                    <span>
                      {menu.disponible ? "Agregar al Carrito" : "Agotado"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[rgba(0,0,0,0.04)] rounded-lg">
            {platillos.length === 0 ? (
              <>
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-[#454545] text-lg mb-4 font-display">
                  No hay menús disponibles en este momento
                </p>
                <p className="text-[#757575] mb-4">
                  Los cocineros están preparando nuevos platillos. ¡Vuelve
                  pronto!
                </p>
                <p className="text-sm text-[#757575] mt-4">
                  💡 Tip: Si eres vendedor, inicia sesión para agregar tus
                  platillos al menú.
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-[#454545] text-lg mb-2 font-display">
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

        {/* Modal de Detalles del Producto */}
        {mostrarModal && productoSeleccionado && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={cerrarModal}
          >
            <div
              className="bg-[#f5f5dc] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                {/* Imagen del producto */}
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-200">
                  {productoSeleccionado.imagen &&
                  productoSeleccionado.imagen.trim() &&
                  (productoSeleccionado.imagen.startsWith("http://") ||
                    productoSeleccionado.imagen.startsWith("https://")) ? (
                    <img
                      src={productoSeleccionado.imagen}
                      alt={productoSeleccionado.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-6xl">🍽️</span>
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div className="md:w-1/2 p-6 md:p-8">
                  <button
                    onClick={cerrarModal}
                    className="absolute top-4 right-4 text-[#3a3a3a] hover:text-[#2d5016] text-2xl"
                  >
                    ×
                  </button>

                  <h2 className="text-3xl font-bold text-[#3a3a3a] mb-3">
                    {productoSeleccionado.nombre}
                  </h2>

                  {/* Categoría */}
                  <span className="inline-block px-3 py-1 bg-[#2d5016] text-white text-sm rounded-full mb-4">
                    {productoSeleccionado.categoria}
                  </span>

                  {/* Calificación */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-2xl ${
                            star <= Math.round(promedioCalificacion.promedio)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-lg text-[#3a3a3a] font-semibold">
                      {promedioCalificacion.promedio > 0
                        ? `${promedioCalificacion.promedio.toFixed(1)} (${
                            promedioCalificacion.total
                          } reseñas)`
                        : "Sin calificaciones"}
                    </span>
                  </div>

                  <p className="text-[#3a3a3a] mb-4">
                    {productoSeleccionado.descripcion}
                  </p>

                  <p className="text-3xl font-bold text-[#fbaf32] mb-6">
                    ${productoSeleccionado.precio.toFixed(2)}
                  </p>

                  {productoSeleccionado.cantidadDisponible !== undefined && (
                    <p className="text-sm text-[#757575] mb-4">
                      Disponibles: {productoSeleccionado.cantidadDisponible}
                    </p>
                  )}

                  {/* Botones de acción */}
                  <div className="flex flex-col gap-3 mb-6">
                    <button
                      onClick={() =>
                        handlePedido(
                          productoSeleccionado,
                          productoSeleccionado.disponible
                        )
                      }
                      disabled={!productoSeleccionado.disponible}
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                        productoSeleccionado.disponible
                          ? "bg-[#fbaf32] hover:bg-[#e69d1f]"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
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
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Agregar al Carrito
                    </button>

                    {user ? (
                      <button
                        onClick={() => {
                          console.log(
                            "👤 Usuario autenticado:",
                            user.uid,
                            user.email
                          );
                          setMostrarFormularioResena(!mostrarFormularioResena);
                        }}
                        className="w-full py-3 px-4 rounded-lg font-semibold bg-[#d32f2f] hover:bg-[#b71c1c] text-white transition-colors flex items-center justify-center gap-2"
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
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                        {mostrarFormularioResena
                          ? "Cancelar Reseña"
                          : "Dejar Reseña"}
                      </button>
                    ) : (
                      <div className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-600 text-center text-sm">
                        Inicia sesión para dejar una reseña
                      </div>
                    )}
                  </div>

                  {/* Formulario de reseña */}
                  {mostrarFormularioResena && user && (
                    <div className="bg-white p-4 rounded-lg mb-6">
                      <h3 className="font-semibold text-[#3a3a3a] mb-3">
                        Calificar Producto
                      </h3>
                      <div className="mb-4">
                        <label className="block text-sm text-[#3a3a3a] mb-2">
                          Calificación
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setCalificacionForm({
                                  ...calificacionForm,
                                  calificacion: star,
                                })
                              }
                              className={`text-2xl ${
                                star <= calificacionForm.calificacion
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-[#3a3a3a] mb-2">
                          Comentario (opcional)
                        </label>
                        <textarea
                          value={calificacionForm.comentario}
                          onChange={(e) =>
                            setCalificacionForm({
                              ...calificacionForm,
                              comentario: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          rows={3}
                          placeholder="Escribe tu opinión sobre este producto..."
                        />
                      </div>
                      <button
                        onClick={handleEnviarResena}
                        disabled={cargandoResena}
                        className="w-full py-2 px-4 bg-[#2d5016] text-white rounded-lg font-semibold hover:bg-[#3a6a1d] transition-colors disabled:opacity-50"
                      >
                        {cargandoResena ? "Enviando..." : "Enviar Reseña"}
                      </button>
                    </div>
                  )}

                  {/* Reseñas de clientes */}
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-[#3a3a3a] mb-4">
                      Reseñas de Clientes
                    </h3>
                    {calificaciones.length > 0 ? (
                      <div className="space-y-4">
                        {calificaciones.map((cal) => (
                          <div key={cal.id} className="bg-white p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-[#2d5016] rounded-full flex items-center justify-center text-white font-semibold">
                                {cal.estudianteNombre?.[0]?.toUpperCase() ||
                                  "U"}
                              </div>
                              <div>
                                <p className="font-semibold text-[#3a3a3a]">
                                  {cal.estudianteNombre || "Usuario"}
                                </p>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`text-sm ${
                                        star <= cal.calificacion
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      ⭐
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {cal.comentario && (
                              <p className="text-[#3a3a3a] text-sm mt-2">
                                {cal.comentario}
                              </p>
                            )}
                            {cal.createdAt && (
                              <p className="text-xs text-[#757575] mt-2">
                                {new Date(cal.createdAt).toLocaleDateString(
                                  "es-ES",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#757575] text-center py-4">
                        Aún no hay reseñas para este producto.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
