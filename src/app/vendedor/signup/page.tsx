import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FoodLink - Registro de Vendedor',
  description: 'Regístrate como vendedor en FoodLink',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 py-6 sm:py-8">
      <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl w-full bg-white rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <Link href="/" className="inline-block mb-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-600">
              🍲 FoodLink
            </h1>
          </Link>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Registro de Usuario
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Únete a nuestra plataforma y conecta con estudiantes
          </p>
        </div>

        {/* Formulario de Registro */}
        <SignupForm />

        {/* Enlace a login */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/vendedor/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

