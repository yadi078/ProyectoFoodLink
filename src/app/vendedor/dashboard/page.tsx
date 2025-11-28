"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logoutVendedor } from "@/services/auth/authService";
import {
  getPlatillosByVendedor,
  createPlatillo,
  updatePlatillo,
  deletePlatillo,
} from "@/services/platillos/platilloService";
import type { Platillo, CategoriaPlatillo } from "@/lib/firebase/types";
import ProductoCard from "@/components/vendedor/ProductoCard";
import ProductoForm from "@/components/vendedor/ProductoForm";

type SortOption = "nombre" | "precio" | "categoria" | "fecha";
type FilterOption =
  | "todos"
  | CategoriaPlatillo
  | "disponible"
  | "no-disponible";

export default function DashboardPage() {
  const router = useRouter();
  const { user, vendedor, loading: authLoading } = useAuth();
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [filteredPlatillos, setFilteredPlatillos] = useState<Platillo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<
    Platillo | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterOption>("todos");
  const [sortBy, setSortBy] = useState<SortOption>("fecha");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/vendedor/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && vendedor) {
      loadPlatillos();
    }
  }, [user, vendedor]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [platillos, searchTerm, filter, sortBy]);

  const loadPlatillos = async () => {
    if (!vendedor) return;

    try {
      setLoading(true);
      const data = await getPlatillosByVendedor(vendedor.uid);
      setPlatillos(data);
    } catch (err: any) {
      setError("Error al cargar los productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...platillos];

    // Aplicar búsqueda
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro
    if (filter === "disponible") {
      filtered = filtered.filter((p) => p.disponible);
    } else if (filter === "no-disponible") {
      filtered = filtered.filter((p) => !p.disponible);
    } else if (filter !== "todos") {
      filtered = filtered.filter((p) => p.categoria === filter);
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "nombre":
          return a.nombre.localeCompare(b.nombre);
        case "precio":
          return a.precio - b.precio;
        case "categoria":
          return a.categoria.localeCompare(b.categoria);
        case "fecha":
          const dateA = a.createdAt?.getTime() || 0;
          const dateB = b.createdAt?.getTime() || 0;
          return dateB - dateA; // Más recientes primero
        default:
          return 0;
      }
    });

    setFilteredPlatillos(filtered);
  };

  const handleCreateProducto = async (
    data: Omit<Platillo, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!vendedor) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await createPlatillo({
        ...data,
        vendedorId: vendedor.uid,
      });
      setSuccess("Producto agregado exitosamente");
      setShowForm(false);
      await loadPlatillos();
    } catch (err: any) {
      setError("Error al agregar el producto");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProducto = async (
    data: Omit<Platillo, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!editingProducto) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await updatePlatillo(editingProducto.id, data);
      setSuccess("Producto actualizado exitosamente");
      setShowForm(false);
      setEditingProducto(undefined);
      await loadPlatillos();
    } catch (err: any) {
      setError("Error al actualizar el producto");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProducto = async (productoId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    try {
      setError(null);
      await deletePlatillo(productoId);
      setSuccess("Producto eliminado exitosamente");
      await loadPlatillos();
    } catch (err: any) {
      setError("Error al eliminar el producto");
      console.error(err);
    }
  };

  const handleEdit = (producto: Platillo) => {
    setEditingProducto(producto);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProducto(undefined);
  };

  const handleLogout = async () => {
    try {
      await logoutVendedor();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !vendedor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-8">
        {/* Header del Dashboard - Parte del contenido normal */}
        <div className="bg-white shadow-sm mb-6 rounded-lg">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  🍲 {vendedor.nombreNegocio || "FoodLink"}
                </h1>
                <p className="text-sm text-gray-600">Panel de Vendedor</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
        {/* Mensajes de éxito/error */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Bienvenida */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            ¡Bienvenido, {vendedor.nombre}!
          </h2>
          <p className="text-gray-600 mt-1">
            Administra tus productos desde aquí
          </p>
        </div>

        {!showForm ? (
          <>
            {/* Herramientas de Administración */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                {/* Búsqueda */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar productos por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input w-full"
                  />
                </div>

                {/* Filtros y Ordenamiento */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterOption)}
                    className="form-input"
                  >
                    <option value="todos">Todas las categorías</option>
                    <option value="Comida rápida">Comida rápida</option>
                    <option value="Comida casera">Comida casera</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Postres">Postres</option>
                    <option value="disponible">Solo disponibles</option>
                    <option value="no-disponible">Solo no disponibles</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="form-input"
                  >
                    <option value="fecha">Más recientes</option>
                    <option value="nombre">Por nombre</option>
                    <option value="precio">Por precio</option>
                    <option value="categoria">Por categoría</option>
                  </select>
                </div>
              </div>

              {/* Botón Agregar Producto */}
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary w-full md:w-auto"
              >
                ➕ Agregar Nuevo Producto
              </button>
            </div>

            {/* Lista de Productos */}
            {filteredPlatillos.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500 text-lg">
                  {platillos.length === 0
                    ? "No tienes productos aún. ¡Agrega tu primer producto!"
                    : "No se encontraron productos con los filtros aplicados."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlatillos.map((producto) => (
                  <ProductoCard
                    key={producto.id}
                    producto={producto}
                    onEdit={handleEdit}
                    onDelete={handleDeleteProducto}
                  />
                ))}
              </div>
            )}

            {/* Estadísticas */}
            {platillos.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Resumen
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Productos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {platillos.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Disponibles</p>
                    <p className="text-2xl font-bold text-green-600">
                      {platillos.filter((p) => p.disponible).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">No Disponibles</p>
                    <p className="text-2xl font-bold text-red-600">
                      {platillos.filter((p) => !p.disponible).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Categorías</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {new Set(platillos.map((p) => p.categoria)).size}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Formulario de Agregar/Editar */
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {editingProducto ? "Editar Producto" : "Agregar Nuevo Producto"}
            </h2>
            <ProductoForm
              producto={editingProducto}
              onSubmit={
                editingProducto ? handleUpdateProducto : handleCreateProducto
              }
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          </div>
        )}
      </main>
    </div>
  );
}
