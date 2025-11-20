/**
 * Componente de Formulario de Registro
 * Interfaz de usuario para registro de nuevos vendedores
 * Implementa validación estricta y principios de seguridad
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterFormData } from '@/utils/validators/authValidators';
import { registerVendedor } from '@/services/auth/authService';

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Registro seguro con Firebase
      // Firebase maneja automáticamente HTTPS y tokens JWT
      await registerVendedor(
        data.email,
        data.password,
        data.nombre,
        data.telefono || undefined
      );

      // Redirigir al dashboard después del registro exitoso
      router.push('/vendedor/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Por favor, intenta de nuevo.');
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

      {/* Campo Nombre */}
      <div>
        <label htmlFor="nombre" className="form-label">
          Nombre Completo *
        </label>
        <input
          id="nombre"
          type="text"
          autoComplete="name"
          className={`form-input ${errors.nombre ? 'form-input-error' : ''}`}
          placeholder="Juan Pérez"
          {...register('nombre')}
        />
        {errors.nombre && (
          <p className="form-error">{errors.nombre.message}</p>
        )}
      </div>

      {/* Campo Email */}
      <div>
        <label htmlFor="email" className="form-label">
          Correo Electrónico *
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

      {/* Campo Teléfono */}
      <div>
        <label htmlFor="telefono" className="form-label">
          Teléfono (Opcional)
        </label>
        <input
          id="telefono"
          type="tel"
          autoComplete="tel"
          className={`form-input ${errors.telefono ? 'form-input-error' : ''}`}
          placeholder="+34 123 456 789"
          {...register('telefono')}
        />
        {errors.telefono && (
          <p className="form-error">{errors.telefono.message}</p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div>
        <label htmlFor="password" className="form-label">
          Contraseña *
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className={`form-input ${errors.password ? 'form-input-error' : ''}`}
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
        </p>
      </div>

      {/* Campo Confirmar Contraseña */}
      <div>
        <label htmlFor="confirmPassword" className="form-label">
          Confirmar Contraseña *
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
          placeholder="••••••••"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Indicador de fortaleza de contraseña */}
      {password && password.length > 0 && (
        <div className="text-xs space-y-1">
          <p className="font-medium text-gray-700">Requisitos de contraseña:</p>
          <ul className="list-disc list-inside space-y-0.5 text-gray-600">
            <li className={password.length >= 8 ? 'text-green-600' : ''}>
              Al menos 8 caracteres {password.length >= 8 ? '✓' : ''}
            </li>
            <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
              Una letra minúscula {/[a-z]/.test(password) ? '✓' : ''}
            </li>
            <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
              Una letra mayúscula {/[A-Z]/.test(password) ? '✓' : ''}
            </li>
            <li className={/\d/.test(password) ? 'text-green-600' : ''}>
              Un número {/\d/.test(password) ? '✓' : ''}
            </li>
          </ul>
        </div>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Registrando...' : 'Registrarse como Vendedor'}
      </button>
    </form>
  );
}

