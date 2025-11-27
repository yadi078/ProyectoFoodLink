import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FoodLink - Inicio de Sesión Vendedor",
  description: "Inicia sesión como vendedor en FoodLink",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 py-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-primary-600">🍲 FoodLink</h1>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Inicio de Sesión
          </h2>
          <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
        </div>

        {/* Formulario de Login */}
        <LoginForm />

        {/* Enlace a registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
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
