'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/utils/validators/authValidators';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useAlert } from '@/components/context/AlertContext';

export default function RegistroPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'estudiante' | 'vendedor'>('estudiante');

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
    try {
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // Actualizar perfil
      await updateProfile(user, {
        displayName: data.nombre,
      });

      // Crear documento en Firestore según el rol
      const userData = {
        email: data.email,
        nombre: data.nombre,
        telefono: data.telefono || '',
        rol: role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (role === 'vendedor') {
        await setDoc(doc(db, 'vendedores', user.uid), userData);
      } else {
        await setDoc(doc(db, 'estudiantes', user.uid), userData);
      }

      showAlert(`¡Bienvenido a FoodLink, ${data.nombre}!`, 'success');

      // Redirigir según el rol
      if (role === 'vendedor') {
        router.push('/vendedor/dashboard');
      } else {
        router.push('/estudiante/menu');
      }
      router.refresh();
    } catch (err: any) {
      const errorMessage =
        err.code === 'auth/email-already-in-use'
          ? 'Este correo electrónico ya está registrado.'
          : 'Error al registrarse. Por favor, intenta de nuevo.';
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
            Crear Cuenta
          </h2>
          <p className="text-gray-600 mt-2">Únete a nuestra comunidad</p>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div>
            <label htmlFor="email" className="form-label">
              Correo Electrónico *
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

          {password && password.length > 0 && (
            <div className="text-xs space-y-1 bg-gray-50 p-3 rounded">
              <p className="font-medium text-gray-700">Requisitos:</p>
              <ul className="space-y-0.5 text-gray-600">
                <li className={password.length >= 8 ? 'text-green-600' : ''}>
                  Al menos 8 caracteres {password.length >= 8 ? '✓' : ''}
                </li>
                <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                  Una minúscula {/[a-z]/.test(password) ? '✓' : ''}
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  Una mayúscula {/[A-Z]/.test(password) ? '✓' : ''}
                </li>
                <li className={/\d/.test(password) ? 'text-green-600' : ''}>
                  Un número {/\d/.test(password) ? '✓' : ''}
                </li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary w-full ${
              role === 'vendedor' ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {isLoading ? 'Registrando...' : `Registrarse como ${role === 'vendedor' ? 'Vendedor' : 'Estudiante'}`}
          </button>
        </form>

        {/* Enlaces */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Inicia sesión aquí
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

