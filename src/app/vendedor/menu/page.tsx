"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VendedorLayout from "@/components/vendedor/VendedorLayout";
import {
  getPlatillosByVendedor,
  createPlatillo,
  updatePlatillo,
  deletePlatillo,
} from "@/services/platillos/platilloService";
import type { Platillo, CategoriaPlatillo } from "@/lib/firebase/types";
import ProductoCard from "@/components/vendedor/ProductoCard";
import ProductoForm from "@/components/vendedor/ProductoForm";
import { useAlert } from "@/components/context/AlertContext";
import ConfirmDialog from "@/components/common/ConfirmDialog";

type SortOption = "nombre" | "precio" | "categoria" | "fecha";
type FilterOption =
  | "todos"
  | CategoriaPlatillo
  | "disponible"
  | "no-disponible";

export default function MenuPage() {
  const router = useRouter();
  const { user, vendedor, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [filteredPlatillos, setFilteredPlatillos] = useState<Platillo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<
    Platillo | undefined
  >();
  const [productoAEliminar, setProductoAEliminar] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterOption>("todos");
  const [sortBy, setSortBy] = useState<SortOption>("fecha");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/vendedor/login");
    }
  }, [user, authLoading, router]);

  const loadPlatillos = useCallback(async () => {
    if (!vendedor) return;

    try {
      setLoading(true);
      const data = await getPlatillosByVendedor(vendedor.uid);
      setPlatillos(data);
    } catch (err: any) {
      showAlert("Error al cargar los productos", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [vendedor, showAlert]);

  const applyFiltersAndSort = useCallback(() => {
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
          return dateB - dateA;
        default:
          return 0;
      }
    });

    setFilteredPlatillos(filtered);
  }, [platillos, searchTerm, filter, sortBy]);

  useEffect(() => {
    if (user && vendedor) {
      loadPlatillos();
    }
  }, [user, vendedor, loadPlatillos]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleCreateProducto = async (
    data: Omit<Platillo, "id" | "createdAt" | "updatedAt">,
    imageFile?: File
  ) => {
    if (!vendedor) return;

    try {
      setIsSubmitting(true);
      await createPlatillo(
        {
          ...data,
          vendedorId: vendedor.uid,
        },
        imageFile
      );
      showAlert("Producto agregado exitosamente", "success");
      setShowForm(false);
      await loadPlatillos();
    } catch (err: any) {
      showAlert("Error al agregar el producto", "error");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProducto = async (
    data: Omit<Platillo, "id" | "createdAt" | "updatedAt">,
    imageFile?: File
  ) => {
    if (!editingProducto) return;

    try {
      setIsSubmitting(true);
      await updatePlatillo(editingProducto.id, data, imageFile);
      showAlert("Producto actualizado exitosamente", "success");
      setShowForm(false);
      setEditingProducto(undefined);
      await loadPlatillos();
    } catch (err: any) {
      showAlert("Error al actualizar el producto", "error");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProducto = async () => {
    if (!productoAEliminar) return;

    try {
      await deletePlatillo(productoAEliminar);
      showAlert("Producto eliminado exitosamente", "success");
      await loadPlatillos();
    } catch (err: any) {
      showAlert("Error al eliminar el producto", "error");
      console.error(err);
    } finally {
      setProductoAEliminar(null);
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1EC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#719A0A] mx-auto"></div>
          <p className="mt-4 text-[#2E2E2E]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !vendedor) {
    return null;
  }

  return (
    <VendedorLayout
      title="Gestión de Menú"
      subtitle="Administra tus platillos y menú"
    >
      {!showForm ? (
        <>
          {/* Herramientas de Administración */}
          <div className="bg-white rounded-xl shadow-soft p-6 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
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
              className="btn-primary w-full md:w-auto shadow-medium hover:shadow-large"
            >
              ➕ Agregar Nuevo Producto
            </button>
          </div>

          {/* Lista de Productos */}
          {filteredPlatillos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-soft p-12 text-center border border-gray-200">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="text-gray-600 text-lg font-medium">
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
                  onDelete={(id) => setProductoAEliminar(id)}
                />
              ))}
            </div>
          )}

          {/* Estadísticas */}
          {platillos.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-soft p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-5 font-display">
                Resumen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Total Productos
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {platillos.length}
                  </p>
                </div>
                <div className="text-center p-4 bg-success-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Disponibles
                  </p>
                  <p className="text-3xl font-bold text-success-600">
                    {platillos.filter((p) => p.disponible).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-error-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    No Disponibles
                  </p>
                  <p className="text-3xl font-bold text-error-600">
                    {platillos.filter((p) => !p.disponible).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Categorías
                  </p>
                  <p className="text-3xl font-bold text-primary-600">
                    {new Set(platillos.map((p) => p.categoria)).size}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Formulario de Agregar/Editar */
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 font-display">
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

      {/* Confirmación de Eliminar Producto */}
      <ConfirmDialog
        isOpen={!!productoAEliminar}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteProducto}
        onCancel={() => setProductoAEliminar(null)}
        type="danger"
      />
    </VendedorLayout>
  );
}
