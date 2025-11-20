/**
 * Componente de Formulario de Login
 * Interfaz de usuario para inicio de sesión de vendedores
 * Implementa validación estricta y manejo seguro de credenciales
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormData } from '@/utils/validators/authValidators';
import { loginVendedor } from '@/services/auth/authService';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Autenticación segura con Firebase
      // Firebase maneja automáticamente HTTPS y tokens JWT
      await loginVendedor(data.email, data.password);

      // Redirigir al dashboard después del login exitoso
      router.push('/vendedor/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Mensaje de error general */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Campo Email */}
      <div>
        <label htmlFor="email" className="form-label">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={`form-input ${errors.email ? 'form-input-error' : ''}`}
          placeholder="vendedor@ejemplo.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="form-error">{errors.email.message}</p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div>
        <label htmlFor="password" className="form-label">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={`form-input ${errors.password ? 'form-input-error' : ''}`}
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}

