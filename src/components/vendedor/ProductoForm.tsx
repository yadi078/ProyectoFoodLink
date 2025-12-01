/**
 * Componente de Formulario para Agregar/Editar Producto
 * Permite a los vendedores crear y editar sus productos
 */

"use client";

import { useState, useEffect } from "react";
import type { Platillo, CategoriaPlatillo } from "@/lib/firebase/types";

const CATEGORIAS: CategoriaPlatillo[] = [
  "Comida rápida",
  "Comida casera",
  "Bebidas",
  "Postres",
];

interface ProductoFormProps {
  producto?: Platillo;
  onSubmit: (data: Omit<Platillo, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductoForm({
  producto,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductoFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "Comida rápida" as CategoriaPlatillo,
    disponible: true,
    cantidadDisponible: "",
    notasAdicionales: "",
    imagen: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio.toString(),
        categoria: producto.categoria,
        disponible: producto.disponible,
        cantidadDisponible: producto.cantidadDisponible?.toString() || "",
        notasAdicionales: producto.notasAdicionales || "",
        imagen: producto.imagen || "",
      });
      if (producto.imagen) {
        setPreviewImage(producto.imagen);
      }
    }
  }, [producto]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "imagen") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setPreviewImage(value || null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (!formData.categoria) {
      newErrors.categoria = "La categoría es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const productoData: any = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        disponible: formData.disponible,
        vendedorId: producto?.vendedorId || "",
      };

      // Solo agregar campos opcionales si tienen valor
      if (formData.imagen && formData.imagen.trim()) {
        productoData.imagen = formData.imagen.trim();
      }
      if (formData.cantidadDisponible && formData.cantidadDisponible.trim()) {
        productoData.cantidadDisponible = parseInt(formData.cantidadDisponible);
      }
      if (formData.notasAdicionales && formData.notasAdicionales.trim()) {
        productoData.notasAdicionales = formData.notasAdicionales.trim();
      }

      await onSubmit(productoData);
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label htmlFor="nombre" className="form-label">
            Nombre del Producto *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            className={`form-input ${errors.nombre ? "form-input-error" : ""}`}
            placeholder="Ej: Tacos al pastor"
          />
          {errors.nombre && <p className="form-error">{errors.nombre}</p>}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label htmlFor="descripcion" className="form-label">
            Descripción Breve *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className={`form-input ${errors.descripcion ? "form-input-error" : ""}`}
            placeholder="Describe tu producto..."
          />
          {errors.descripcion && (
            <p className="form-error">{errors.descripcion}</p>
          )}
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="precio" className="form-label">
            Precio *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold pointer-events-none z-10">
              $
            </span>
            <input
              id="precio"
              name="precio"
              type="number"
              step="0.01"
              min="0"
              value={formData.precio}
              onChange={handleChange}
              className={`w-full py-3 pr-4 pl-[3.5rem] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none text-base min-h-[44px] ${errors.precio ? "border-red-500 focus:ring-red-500" : ""}`}
              placeholder="0.00"
            />
          </div>
          {errors.precio && <p className="form-error">{errors.precio}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoria" className="form-label">
            Categoría *
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className={`form-input ${errors.categoria ? "form-input-error" : ""}`}
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <p className="form-error">{errors.categoria}</p>
          )}
        </div>

        {/* Imagen */}
        <div className="md:col-span-2">
          <label htmlFor="imagen" className="form-label">
            URL de la Imagen
          </label>
          <input
            id="imagen"
            name="imagen"
            type="url"
            value={formData.imagen}
            onChange={handleChange}
            className="form-input"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingresa la URL de la imagen del producto
          </p>
        </div>

        {/* Vista Previa de Imagen */}
        {previewImage && (
          <div className="md:col-span-2">
            <label className="form-label">Vista Previa</label>
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={previewImage}
                alt="Vista previa"
                className="w-full h-full object-cover"
                onError={() => setPreviewImage(null)}
              />
            </div>
          </div>
        )}

        {/* Cantidad Disponible */}
        <div>
          <label htmlFor="cantidadDisponible" className="form-label">
            Cantidad Disponible (Opcional)
          </label>
          <input
            id="cantidadDisponible"
            name="cantidadDisponible"
            type="number"
            min="0"
            value={formData.cantidadDisponible}
            onChange={handleChange}
            className="form-input"
            placeholder="Ej: 10"
          />
        </div>

        {/* Disponible */}
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="form-label mb-0">Producto Disponible</span>
          </label>
        </div>

        {/* Notas Adicionales */}
        <div className="md:col-span-2">
          <label htmlFor="notasAdicionales" className="form-label">
            Notas Adicionales (Opcional)
          </label>
          <textarea
            id="notasAdicionales"
            name="notasAdicionales"
            value={formData.notasAdicionales}
            onChange={handleChange}
            rows={2}
            className="form-input"
            placeholder="Información adicional sobre el producto..."
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading
            ? "Guardando..."
            : producto
            ? "Actualizar Producto"
            : "Agregar Producto"}
        </button>
      </div>
    </form>
  );
}

