/**
 * Hook personalizado para autenticación
 * Maneja el estado de autenticación del vendedor
 */

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getCurrentVendedor } from '@/services/auth/authService';
import type { Vendedor } from '@/lib/firebase/types';

interface UseAuthReturn {
  user: User | null;
  vendedor: Vendedor | null;
  loading: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [vendedor, setVendedor] = useState<Vendedor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Si hay usuario autenticado, obtener datos del vendedor
        const vendedorData = await getCurrentVendedor();
        setVendedor(vendedorData);
      } else {
        setVendedor(null);
      }

      setLoading(false);
    });

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, []);

  return { user, vendedor, loading };
};

