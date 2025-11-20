/**
 * Hook personalizado para información de estudiante
 * Maneja el estado del estudiante autenticado
 */

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getCurrentEstudiante } from '@/services/auth/authService';
import type { Estudiante } from '@/lib/firebase/types';

interface UseEstudianteReturn {
  user: User | null;
  estudiante: Estudiante | null;
  loading: boolean;
}

export const useEstudiante = (): UseEstudianteReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Si hay usuario autenticado, obtener datos del estudiante
        const estudianteData = await getCurrentEstudiante();
        setEstudiante(estudianteData);
      } else {
        setEstudiante(null);
      }

      setLoading(false);
    });

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, []);

  return { user, estudiante, loading };
};

