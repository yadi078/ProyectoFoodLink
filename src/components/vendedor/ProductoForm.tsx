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
  onSubmit: (
    data: Omit<Platillo, "id" | "createdAt" | "updatedAt">,
    imageFile?: File
  ) => Promise<void>;
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageValidationError, setImageValidationError] = useState<
    string | null
  >(null);

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
      // Limpiar archivo de imagen al editar (mantener la existente por defecto)
      setImageFile(null);
    }
  }, [producto]);

  // Limpiar objeto URL cuando el componente se desmonte o cambie la imagen
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Validar imagen según los límites de FoodLink
  const validateImage = async (file: File): Promise<string | null> => {
    // Validar formato
    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!allowedFormats.includes(file.type.toLowerCase())) {
      return "Formato no permitido. Solo se aceptan: JPG, JPEG, PNG, WebP";
    }

    // Validar tamaño del archivo (50 KB - 2 MB)
    const minSize = 50 * 1024; // 50 KB
    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size < minSize) {
      return `La imagen es muy pequeña. Mínimo: 50 KB (actual: ${Math.round(
        file.size / 1024
      )} KB)`;
    }
    if (file.size > maxSize) {
      return `La imagen es muy grande. Máximo: 2 MB (actual: ${(
        file.size /
        (1024 * 1024)
      ).toFixed(2)} MB)`;
    }

    // Validar dimensiones (400x400px - 1920x1920px)
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        if (width < 400 || height < 400) {
          resolve(
            `Dimensiones muy pequeñas. Mínimo: 400x400px (actual: ${width}x${height}px)`
          );
        } else if (width > 1920 || height > 1920) {
          resolve(
            `Dimensiones muy grandes. Máximo: 1920x1920px (actual: ${width}x${height}px)`
          );
        } else {
          resolve(null); // Sin errores
        }

        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        resolve("Error al cargar la imagen para validar dimensiones");
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;

      if (file) {
        // Validar imagen
        const validationError = await validateImage(file);
        if (validationError) {
          setImageValidationError(validationError);
          setImageFile(null);
          setPreviewImage(producto?.imagen || null);
          // Limpiar el input
          (e.target as HTMLInputElement).value = "";
          return;
        }

        // Si la validación es exitosa
        setImageValidationError(null);
        setImageFile(file);
        // Crear preview de la imagen seleccionada
        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);
      } else {
        // Si no hay archivo, volver a la imagen existente (si está editando)
        setImageValidationError(null);
        setImageFile(null);
        setPreviewImage(producto?.imagen || null);
      }
    } else if (name === "imagen") {
      // Mantener compatibilidad con input de URL (opcional)
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (!imageFile) {
        setPreviewImage(value || null);
      }
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
    } else if (formData.nombre.trim().length > 35) {
      newErrors.nombre = "El nombre no puede tener más de 35 caracteres";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    } else if (formData.descripcion.trim().length > 150) {
      newErrors.descripcion =
        "La descripción no puede tener más de 150 caracteres";
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

      // Si hay una URL de imagen manual (sin archivo), mantenerla
      if (!imageFile && formData.imagen && formData.imagen.trim()) {
        productoData.imagen = formData.imagen.trim();
      }

      await onSubmit(productoData, imageFile || undefined);
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="nombre" className="form-label mb-0">
              Nombre del Producto *
            </label>
            <span
              className={`text-xs font-medium ${
                formData.nombre.length > 35
                  ? "text-error-500"
                  : formData.nombre.length > 30
                  ? "text-warning-500"
                  : "text-gray-500"
              }`}
            >
              {formData.nombre.length}/35
            </span>
          </div>
          <input
            id="nombre"
            name="nombre"
            type="text"
            maxLength={35}
            value={formData.nombre}
            onChange={handleChange}
            className={`form-input ${errors.nombre ? "form-input-error" : ""}`}
            placeholder="Ej: Tacos al pastor"
          />
          {errors.nombre && <p className="form-error">{errors.nombre}</p>}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="descripcion" className="form-label mb-0">
              Descripción Breve *
            </label>
            <span
              className={`text-xs font-medium ${
                formData.descripcion.length > 150
                  ? "text-error-500"
                  : formData.descripcion.length > 140
                  ? "text-warning-500"
                  : "text-gray-500"
              }`}
            >
              {formData.descripcion.length}/150
            </span>
          </div>
          <textarea
            id="descripcion"
            name="descripcion"
            maxLength={150}
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className={`form-input ${
              errors.descripcion ? "form-input-error" : ""
            }`}
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
              className={`w-full py-3 pr-4 pl-[3.5rem] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none text-base min-h-[44px] ${
                errors.precio ? "border-red-500 focus:ring-red-500" : ""
              }`}
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
            className={`form-input ${
              errors.categoria ? "form-input-error" : ""
            }`}
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoria && <p className="form-error">{errors.categoria}</p>}
        </div>

        {/* Imagen - Carga de archivo */}
        <div className="md:col-span-2">
          <label htmlFor="imagenFile" className="form-label">
            Imagen del Producto
          </label>
          <input
            id="imagenFile"
            name="imagenFile"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleChange}
            className={`form-input ${
              imageValidationError ? "form-input-error" : ""
            }`}
          />
          {imageValidationError && (
            <p className="form-error mt-2">{imageValidationError}</p>
          )}
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 mb-1">
              📋 Requisitos de Imagen FoodLink:
            </p>
            <ul className="text-xs text-blue-800 space-y-0.5 ml-4">
              <li>
                📏 <strong>Tamaño:</strong> 50 KB - 2 MB (óptimo: 200-500 KB)
              </li>
              <li>
                📐 <strong>Dimensiones:</strong> 400x400px - 1920x1920px
                (óptimo: 800x800px)
              </li>
              <li>
                📄 <strong>Formatos:</strong> JPG, JPEG, PNG, WebP
              </li>
              <li>
                🎯 <strong>Calidad:</strong> Compresión JPEG 80-85%
              </li>
            </ul>
          </div>
        </div>

        {/* Imagen - URL alternativa (opcional) */}
        <div className="md:col-span-2">
          <label htmlFor="imagen" className="form-label">
            O ingresa una URL de imagen (opcional)
          </label>
          <input
            id="imagen"
            name="imagen"
            type="url"
            value={formData.imagen}
            onChange={handleChange}
            className="form-input"
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={!!imageFile}
          />
          <p className="text-xs text-gray-500 mt-1">
            {imageFile
              ? "Desactiva la selección de archivo para usar una URL"
              : "Si prefieres usar una URL en lugar de subir un archivo"}
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
                className="w-full h-full object-cover object-center"
                style={{ objectFit: "cover", objectPosition: "center" }}
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
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary shadow-soft hover:shadow-medium"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary shadow-medium hover:shadow-large"
          disabled={isLoading}
        >
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
