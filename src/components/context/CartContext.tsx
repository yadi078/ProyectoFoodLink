"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Platillo } from "@/lib/firebase/types";

export interface CartItem {
  platillo: Platillo;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (platillo: Platillo, cantidad?: number) => void;
  removeItem: (platilloId: string) => void;
  updateQuantity: (platilloId: string, cantidad: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("🛒 Carrito cargado desde localStorage:", parsedCart);

        // Validar que sea un array
        if (!Array.isArray(parsedCart)) {
          console.warn("⚠️ Carrito no es un array, limpiando...");
          localStorage.removeItem("cart");
          return;
        }

        // Filtrar items con cantidad > 0 y validar estructura
        const validCart = parsedCart.filter((item: CartItem) => {
          // Validar estructura básica
          if (!item || !item.platillo || typeof item.cantidad !== "number") {
            console.warn("⚠️ Item inválido encontrado:", item);
            return false;
          }
          return item.cantidad > 0;
        });

        console.log("✅ Items válidos en carrito:", validCart.length);
        setItems(validCart);

        // Si se filtraron items, actualizar localStorage
        if (validCart.length !== parsedCart.length) {
          localStorage.setItem("cart", JSON.stringify(validCart));
        }
      } catch (error) {
        console.error("❌ Error al cargar el carrito:", error);
        // Si hay error, limpiar el localStorage corrupto
        localStorage.removeItem("cart");
      }
    } else {
      console.log("🛒 No hay carrito guardado en localStorage");
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Solo guardar items válidos (cantidad > 0)
    const validItems = items.filter((item) => {
      // Validar estructura antes de guardar
      return (
        item &&
        item.platillo &&
        typeof item.cantidad === "number" &&
        item.cantidad > 0
      );
    });

    if (validItems.length > 0) {
      // Limpiar fechas y otros campos que no se necesitan para el carrito
      const itemsToSave = validItems.map((item) => ({
        platillo: {
          id: item.platillo.id,
          nombre: item.platillo.nombre,
          descripcion: item.platillo.descripcion,
          precio: item.platillo.precio,
          disponible: item.platillo.disponible,
          vendedorId: item.platillo.vendedorId,
          imagen: item.platillo.imagen,
          categoria: item.platillo.categoria,
          cantidadDisponible: item.platillo.cantidadDisponible,
          // No guardar createdAt/updatedAt para evitar problemas de serialización
        },
        cantidad: item.cantidad,
      }));

      localStorage.setItem("cart", JSON.stringify(itemsToSave));
      console.log(
        "💾 Carrito guardado en localStorage:",
        itemsToSave.length,
        "items"
      );
    } else {
      // Si no hay items válidos, limpiar localStorage
      localStorage.removeItem("cart");
      console.log("🗑️ Carrito vacío, limpiando localStorage");
    }
  }, [items]);

  const addItem = (platillo: Platillo, cantidad: number = 1) => {
    console.log(
      "➕ Agregando al carrito:",
      platillo.nombre,
      "cantidad:",
      cantidad
    );
    console.log("➕ Platillo completo:", platillo);

    if (!platillo || !platillo.id) {
      console.error("❌ Error: Platillo inválido", platillo);
      return;
    }

    if (cantidad <= 0) {
      console.error("❌ Error: Cantidad inválida", cantidad);
      return;
    }

    setItems((prevItems) => {
      console.log("🛒 Items previos:", prevItems.length);
      const existingItem = prevItems.find(
        (item) => item.platillo.id === platillo.id
      );

      if (existingItem) {
        // Si ya existe, aumentar la cantidad
        const updated = prevItems.map((item) =>
          item.platillo.id === platillo.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
        console.log("✅ Cantidad actualizada. Total items:", updated.length);
        console.log(
          "✅ Item actualizado:",
          updated.find((item) => item.platillo.id === platillo.id)
        );
        return updated;
      } else {
        // Si no existe, agregar nuevo item
        const newItem = { platillo, cantidad };
        const updated = [...prevItems, newItem];
        console.log("✅ Nuevo item agregado. Total items:", updated.length);
        console.log("✅ Nuevo item:", newItem);
        return updated;
      }
    });
  };

  const removeItem = (platilloId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.platillo.id !== platilloId)
    );
  };

  const updateQuantity = (platilloId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(platilloId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.platillo.id === platilloId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = (): number => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = (): number => {
    return items.reduce(
      (total, item) => total + item.platillo.precio * item.cantidad,
      0
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Prevenir scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (isCartOpen) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restaurar el scroll al cerrar
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isCartOpen]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
