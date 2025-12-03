import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FoodLink - Inicio de Sesión Vendedor",
  description: "Inicia sesión como vendedor en FoodLink",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 py-6 sm:py-8">
      <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl w-full bg-white rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <Link href="/" className="inline-block mb-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-600">🍲 FoodLink</h1>
          </Link>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Inicio de Sesión
          </h2>
          <p className="text-sm text-gray-600 mt-2">Accede a tu cuenta</p>
        </div>

        {/* Formulario de Login */}
        <LoginForm />

        {/* Enlace a registro */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/vendedor/signup"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
