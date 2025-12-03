/**
 * Componente de Formulario de Login
 * Interfaz de usuario para inicio de sesión de usuarios (alumnos o vendedores)
 * Implementa validación estricta y manejo seguro de credenciales
 * Sistema de pasos: Tipo de usuario → Credenciales
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  loginSchema,
  type LoginFormData,
} from "@/utils/validators/authValidators";
import { loginUser } from "@/services/auth/authService";
import UserTypeSelector from "./UserTypeSelector";

type TipoUsuario = "alumno" | "vendedor" | null;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      tipoUsuario: undefined,
    },
  });

  // Manejar selección de tipo de usuario
  const handleTipoUsuarioSelect = (tipo: "alumno" | "vendedor") => {
    setTipoUsuario(tipo);
    setValue("tipoUsuario", tipo);
    trigger("tipoUsuario");
  };

  // Validar paso actual antes de avanzar
  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 1) {
      return tipoUsuario !== null;
    }
    if (step === 2) {
      const isValid = await trigger(["email", "password"]);
      return isValid;
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep === 2) {
        // Último paso, enviar formulario
        const form = document.querySelector("form") as HTMLFormElement;
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
      setError(null); // Limpiar errores al volver
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Autenticación segura con Firebase
      // Firebase maneja automáticamente HTTPS y tokens JWT
      await loginUser(data.tipoUsuario, data.email, data.password);

      // Redirigir según el tipo de usuario
      if (data.tipoUsuario === "vendedor") {
        router.push("/vendedor/dashboard");
      } else {
        router.push("/menu"); // Redirigir a la página del menú para alumnos/maestros
      }
      router.refresh();
    } catch (err: any) {
      setError(
        err.message || "Error al iniciar sesión. Por favor, intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Indicador de pasos */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          {[1, 2].map((step) => {
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;

            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all text-sm sm:text-base ${
                      isActive
                        ? "bg-primary-600 text-white scale-110"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? "✓" : step}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 text-center ${
                      isActive
                        ? "text-primary-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {step === 1 ? "Tipo de Usuario" : "Credenciales"}
                  </span>
                </div>
                {step < 2 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
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
        <div className="bg-error-50 border border-error-200 text-error-700 px-5 py-4 rounded-xl shadow-soft">
          {error}
        </div>
      )}

      {/* Paso 1: Selección de tipo de usuario */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <input
            type="hidden"
            {...register("tipoUsuario")}
            value={tipoUsuario || ""}
          />

          <UserTypeSelector
            selectedType={tipoUsuario}
            onSelect={handleTipoUsuarioSelect}
            error={errors.tipoUsuario?.message}
          />

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

      {/* Paso 2: Credenciales */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Credenciales de Acceso
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa tu correo electrónico y contraseña
            </p>
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
              className={`form-input ${errors.email ? "form-input-error" : ""}`}
              placeholder="usuario@ejemplo.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
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
              autoComplete="current-password"
              className={`form-input ${
                errors.password ? "form-input-error" : ""
              }`}
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
            >
              Atrás
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </div>
        </div>
      )}

      {/* Input oculto para mantener el valor del tipoUsuario */}
      <input type="hidden" {...register("tipoUsuario")} />
    </form>
  );
}
