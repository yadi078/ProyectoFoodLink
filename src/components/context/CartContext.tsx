'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Platillo } from '@/lib/firebase/types';

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
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (platillo: Platillo, cantidad: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.platillo.id === platillo.id);

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
    setItems((prevItems) => prevItems.filter((item) => item.platillo.id !== platilloId));
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
    return items.reduce((total, item) => total + item.platillo.precio * item.cantidad, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Prevenir scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (isCartOpen) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaurar el scroll al cerrar
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
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
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

