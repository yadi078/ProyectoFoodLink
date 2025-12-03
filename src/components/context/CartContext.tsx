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
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);

        // Validar que sea un array
        if (!Array.isArray(parsedCart)) {
          localStorage.removeItem("cart");
          setIsHydrated(true);
          return;
        }

        // Filtrar items con cantidad > 0 y validar estructura
        const validCart = parsedCart.filter((item: CartItem) => {
          // Validar estructura básica
          if (!item || !item.platillo || typeof item.cantidad !== "number") {
            return false;
          }
          return item.cantidad > 0;
        });

        setItems(validCart);

        // Si se filtraron items, actualizar localStorage
        if (validCart.length !== parsedCart.length) {
          localStorage.setItem("cart", JSON.stringify(validCart));
        }
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
        // Si hay error, limpiar el localStorage corrupto
        localStorage.removeItem("cart");
      }
    }

    setIsHydrated(true);
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;

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
    } else {
      // Si no hay items válidos, limpiar localStorage
      localStorage.removeItem("cart");
    }
  }, [items, isHydrated]);

  const addItem = (platillo: Platillo, cantidad: number = 1) => {
    if (!platillo || !platillo.id) {
      console.error("Error: Platillo inválido");
      return;
    }

    if (cantidad <= 0) {
      console.error("Error: Cantidad inválida");
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.platillo.id === platillo.id
      );

      if (existingItem) {
        // Si ya existe, aumentar la cantidad
        return prevItems.map((item) =>
          item.platillo.id === platillo.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, { platillo, cantidad }];
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
    if (typeof window === "undefined") return;

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
        isHydrated,
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
