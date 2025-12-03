/**
 * Componente reutilizable para selección de tipo de usuario
 * Usado en LoginForm y SignupForm para evitar duplicación
 */

"use client";

type TipoUsuario = "alumno" | "vendedor" | null;

interface UserTypeSelectorProps {
  selectedType: TipoUsuario;
  onSelect: (tipo: "alumno" | "vendedor") => void;
  error?: string;
}

export default function UserTypeSelector({
  selectedType,
  onSelect,
  error,
}: UserTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          ¿Qué tipo de usuario eres?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona el tipo de cuenta con la que deseas continuar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelect("alumno")}
          className={`p-4 sm:p-5 rounded-lg border-2 transition-all text-left ${
            selectedType === "alumno"
              ? "border-primary-600 bg-primary-50 shadow-md"
              : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl ${
                selectedType === "alumno"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              🎓
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-base sm:text-lg">
                Alumno/Maestro
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Accede a tu cuenta de estudiante
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect("vendedor")}
          className={`p-4 sm:p-5 rounded-lg border-2 transition-all text-left ${
            selectedType === "vendedor"
              ? "border-primary-600 bg-primary-50 shadow-md"
              : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl ${
                selectedType === "vendedor"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              👨‍🍳
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-base sm:text-lg">
                Vendedor (Cocinero)
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Accede a tu cuenta de vendedor
              </p>
            </div>
          </div>
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

