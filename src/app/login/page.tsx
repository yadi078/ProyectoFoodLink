'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/utils/validators/authValidators';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAlert } from '@/components/context/AlertContext';

export default function LoginPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'estudiante' | 'vendedor'>('estudiante');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      showAlert('¡Bienvenido de nuevo!', 'success');
      
      // Redirigir según el rol seleccionado
      if (role === 'vendedor') {
        router.push('/vendedor/dashboard');
      } else {
        router.push('/estudiante/menu');
      }
      router.refresh();
    } catch (err: any) {
      const errorMessage =
        err.code === 'auth/user-not-found'
          ? 'No existe una cuenta con este correo electrónico.'
          : err.code === 'auth/wrong-password'
          ? 'La contraseña es incorrecta.'
          : 'Error al iniciar sesión. Por favor, intenta de nuevo.';
      showAlert(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-primary-600">
              🍲 FoodLink
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800">
            Inicio de Sesión
          </h2>
          <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
        </div>

        {/* Selector de Rol */}
        <div className="mb-6 bg-gray-100 rounded-lg p-1 flex">
          <button
            type="button"
            onClick={() => setRole('estudiante')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              role === 'estudiante'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            👨‍🎓 Estudiante
          </button>
          <button
            type="button"
            onClick={() => setRole('vendedor')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              role === 'vendedor'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            👨‍🍳 Vendedor
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="tu@ejemplo.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

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

          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary w-full ${
              role === 'vendedor' ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Enlaces */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/registro"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Regístrate aquí
            </Link>
          </p>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

