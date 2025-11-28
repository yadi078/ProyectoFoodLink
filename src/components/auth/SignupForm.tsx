/**
 * Componente de Formulario de Registro
 * Interfaz de usuario para registro de nuevos usuarios (alumnos o vendedores)
 * Implementa validación estricta y principios de seguridad
 * Sistema de pasos: Rol → Datos personales → Datos adicionales (solo vendedores)
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterFormData } from '@/utils/validators/authValidators';
import { registerUser } from '@/services/auth/authService';
import type { HorarioServicio } from '@/lib/firebase/types';

type TipoUsuario = 'alumno' | 'vendedor' | null;

const TIPOS_COMIDA = ['Comida rápida', 'Comida casera', 'Bebidas', 'Postres'];
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      tipoUsuario: undefined,
    },
  });

  const password = watch('password');
  const tipoComida = watch('tipoComida') || [];
  const horarioInicio = watch('horarioInicio');
  const horarioFin = watch('horarioFin');
  const diasDescanso = watch('diasDescanso') || [];

  // Manejar selección de tipo de usuario
  const handleTipoUsuarioSelect = (tipo: 'alumno' | 'vendedor') => {
    setTipoUsuario(tipo);
    setValue('tipoUsuario', tipo);
    trigger('tipoUsuario');
  };

  // Validar paso actual antes de avanzar
  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 1) {
      return tipoUsuario !== null;
    }
    if (step === 2) {
      const campos = ['nombre', 'email', 'password', 'confirmPassword', 'zona'];
      if (tipoUsuario === 'alumno') {
        campos.push('institucionEducativa');
      }
      const isValid = await trigger(campos as any);
      return isValid;
    }
    if (step === 3 && tipoUsuario === 'vendedor') {
      const isValid = await trigger(['nombreNegocio', 'tipoComida', 'horarioInicio', 'horarioFin']);
      return isValid;
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep === 3 || (currentStep === 2 && tipoUsuario === 'alumno')) {
        // Último paso, enviar formulario
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const horario: HorarioServicio | undefined =
        data.horarioInicio && data.horarioFin
          ? {
              inicio: data.horarioInicio,
              fin: data.horarioFin,
            }
          : undefined;

      await registerUser(
        data.tipoUsuario,
        data.email,
        data.password,
        data.nombre,
        data.zona,
        data.telefono || undefined,
        data.institucionEducativa || undefined,
        data.nombreNegocio || undefined,
        data.tipoComida,
        horario,
        data.diasDescanso
      );

      // Redirigir según el tipo de usuario
      if (data.tipoUsuario === 'vendedor') {
        router.push('/vendedor/dashboard');
      } else {
        router.push('/'); // O la ruta que corresponda para estudiantes
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = tipoUsuario === 'vendedor' ? 3 : 2;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Indicador de pasos */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => {
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            const isAccessible = step <= totalSteps;

            if (!isAccessible) return null;

            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white scale-110'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? '✓' : step}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      isActive ? 'text-primary-600 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {step === 1
                      ? 'Rol'
                      : step === 2
                      ? 'Datos Personales'
                      : 'Datos Adicionales'}
                  </span>
                </div>
                {step < totalSteps && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mensaje de error general */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Paso 1: Selección de tipo de usuario */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ¿Qué tipo de usuario eres?
            </h3>
            <p className="text-gray-600 mb-6">
              Selecciona el tipo de cuenta que deseas crear
            </p>
          </div>

          <input
            type="hidden"
            {...register('tipoUsuario')}
            value={tipoUsuario || ''}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleTipoUsuarioSelect('alumno')}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                tipoUsuario === 'alumno'
                  ? 'border-primary-600 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    tipoUsuario === 'alumno'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  🎓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    Alumno/Maestro
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Accede a comida deliciosa
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTipoUsuarioSelect('vendedor')}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                tipoUsuario === 'vendedor'
                  ? 'border-primary-600 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    tipoUsuario === 'vendedor'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  👨‍🍳
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    Vendedor (Cocinero)
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Vende tu comida a estudiantes
                  </p>
                </div>
              </div>
            </button>
          </div>

          {errors.tipoUsuario && (
            <p className="form-error">{errors.tipoUsuario.message}</p>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleNext}
              disabled={!tipoUsuario}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Datos personales */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Datos Personales
            </h3>
            <p className="text-gray-600 mb-6">
              Completa tu información básica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo Nombre */}
            <div className="md:col-span-2">
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
            <div className="md:col-span-2">
              <label htmlFor="email" className="form-label">
                Correo Electrónico *
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                placeholder="usuario@ejemplo.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Teléfono */}
            <div className="md:col-span-2">
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

            {/* Campo Zona */}
            <div className="md:col-span-2">
              <label htmlFor="zona" className="form-label">
                Zona *
              </label>
              <select
                id="zona"
                className={`form-input ${errors.zona ? 'form-input-error' : ''}`}
                {...register('zona')}
              >
                <option value="">Selecciona una zona</option>
                <option value="Zona Norte">Zona Norte</option>
                <option value="Zona Centro">Zona Centro</option>
                <option value="Zona Sur">Zona Sur</option>
              </select>
              {errors.zona && (
                <p className="form-error">{errors.zona.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Selecciona en qué parte de Rincón de Romos te encuentras
              </p>
            </div>

            {/* Campo Institución Educativa (solo para alumnos) */}
            {tipoUsuario === 'alumno' && (
              <div className="md:col-span-2">
                <label htmlFor="institucionEducativa" className="form-label">
                  Institución Educativa *
                </label>
                <input
                  id="institucionEducativa"
                  type="text"
                  className={`form-input ${errors.institucionEducativa ? 'form-input-error' : ''}`}
                  placeholder="Ej: Universidad Tecnológica de Aguascalientes"
                  {...register('institucionEducativa')}
                />
                {errors.institucionEducativa && (
                  <p className="form-error">{errors.institucionEducativa.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Escribe el nombre de la escuela o universidad a la que perteneces
                </p>
              </div>
            )}

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
          </div>

          {/* Indicador de fortaleza de contraseña */}
          {password && password.length > 0 && (
            <div className="text-xs space-y-1 bg-gray-50 p-3 rounded-lg">
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

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
            >
              Atrás
            </button>
            {tipoUsuario === 'vendedor' ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Paso 3: Datos adicionales (solo para vendedores) */}
      {currentStep === 3 && tipoUsuario === 'vendedor' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Información del Negocio
            </h3>
            <p className="text-gray-600 mb-6">
              Completa los datos adicionales de tu negocio
            </p>
          </div>

          {/* Nombre del Negocio */}
          <div>
            <label htmlFor="nombreNegocio" className="form-label">
              Nombre del Negocio *
            </label>
            <input
              id="nombreNegocio"
              type="text"
              className={`form-input ${errors.nombreNegocio ? 'form-input-error' : ''}`}
              placeholder="Ej: Tacos El Güero"
              {...register('nombreNegocio')}
            />
            {errors.nombreNegocio && (
              <p className="form-error">{errors.nombreNegocio.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              El nombre que aparecerá en tu panel y para los clientes
            </p>
          </div>

          {/* Tipo de comida */}
          <div>
            <label className="form-label">
              ¿Qué tipo de comida vendes? *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {TIPOS_COMIDA.map((tipo) => (
                <label
                  key={tipo}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    tipoComida.includes(tipo)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={tipo}
                    {...register('tipoComida')}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{tipo}</span>
                </label>
              ))}
            </div>
            {errors.tipoComida && (
              <p className="form-error">{errors.tipoComida.message}</p>
            )}
          </div>

          {/* Horario de servicio */}
          <div>
            <label className="form-label mb-4 block">
              Horario de Servicio *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="horarioInicio" className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Inicio
                </label>
                <input
                  id="horarioInicio"
                  type="time"
                  className={`form-input ${errors.horarioInicio ? 'form-input-error' : ''}`}
                  {...register('horarioInicio')}
                />
                {errors.horarioInicio && (
                  <p className="form-error">{errors.horarioInicio.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="horarioFin" className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Fin
                </label>
                <input
                  id="horarioFin"
                  type="time"
                  className={`form-input ${errors.horarioFin ? 'form-input-error' : ''}`}
                  {...register('horarioFin')}
                />
                {errors.horarioFin && (
                  <p className="form-error">{errors.horarioFin.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Días de descanso */}
          <div>
            <label className="form-label">
              Días de Descanso (Opcional)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Selecciona los días en los que no atenderás
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DIAS_SEMANA.map((dia) => (
                <label
                  key={dia}
                  className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                    diasDescanso.includes(dia)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={dia}
                    {...register('diasDescanso')}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{dia}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Registrando...' : 'Registrarse como Vendedor'}
            </button>
          </div>
        </div>
      )}

      {/* Input oculto para mantener el valor del tipoUsuario */}
      <input type="hidden" {...register('tipoUsuario')} />
    </form>
  );
}
