import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FoodLink - Conecta estudiantes con comida casera',
  description: 'Plataforma que conecta estudiantes universitarios con vendedores de comida casera',
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🍲 Bienvenido a{' '}
              <span className="text-primary-600">FoodLink</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Conectamos estudiantes universitarios con{' '}
              <span className="text-green-600 font-semibold">comida casera</span>,{' '}
              <span className="text-primary-600 font-semibold">nutritiva</span> y{' '}
              <span className="text-yellow-500 font-semibold">accesible</span>
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Apoya a familias y microemprendedores locales mientras disfrutas de
              comida deliciosa cerca de tu universidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registro" className="btn-primary inline-block">
                Comenzar Ahora
              </Link>
              <Link href="/sobre-nosotros" className="btn-outline inline-block">
                Conocer Más
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problemática y Solución */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cuál es el Problema?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los estudiantes universitarios enfrentan dificultades para acceder a
              comida casera, nutritiva y económica cerca de sus universidades.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-red-700 mb-4">
                El Problema ❌
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Comida rápida poco nutritiva y costosa</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Falta de opciones de comida casera cerca de universidades</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Difícil acceso a comida saludable y económica</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Microemprendedores no tienen visibilidad</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-green-700 mb-4">
                Nuestra Solución ✅
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Plataforma que conecta estudiantes con vendedores locales</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Comida casera, nutritiva y accesible</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Pedidos anticipados y entrega a domicilio</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Apoyo a microemprendedores y familias locales</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bloque de Valor */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir FoodLink?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Beneficios para Estudiantes */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary-600">
              <h3 className="text-2xl font-bold text-primary-600 mb-4">
                👨‍🎓 Para Estudiantes
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-500 text-xl mr-3">⭐</span>
                  <div>
                    <strong className="text-gray-900">Comida Casera y Nutritiva</strong>
                    <p className="text-sm text-gray-600">
                      Accede a comida hecha en casa, fresca y saludable
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 text-xl mr-3">💰</span>
                  <div>
                    <strong className="text-gray-900">Precios Accesibles</strong>
                    <p className="text-sm text-gray-600">
                      Opciones económicas que se ajustan a tu presupuesto
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 text-xl mr-3">📍</span>
                  <div>
                    <strong className="text-gray-900">Cerca de tu Universidad</strong>
                    <p className="text-sm text-gray-600">
                      Vendedores locales cerca de tu campus
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 text-xl mr-3">🚚</span>
                  <div>
                    <strong className="text-gray-900">Recolección o Entrega</strong>
                    <p className="text-sm text-gray-600">
                      Elige la opción que mejor te convenga
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Beneficios para Vendedores */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600">
              <h3 className="text-2xl font-bold text-green-600 mb-4">
                👨‍🍳 Para Vendedores
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">📈</span>
                  <div>
                    <strong className="text-gray-900">Mayor Visibilidad</strong>
                    <p className="text-sm text-gray-600">
                      Llega a más estudiantes y aumenta tus ventas
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">📱</span>
                  <div>
                    <strong className="text-gray-900">Gestión Fácil</strong>
                    <p className="text-sm text-gray-600">
                      Gestiona menús y pedidos desde un solo lugar
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">💰</span>
                  <div>
                    <strong className="text-gray-900">Ingresos Adicionales</strong>
                    <p className="text-sm text-gray-600">
                      Genera ingresos extra desde tu hogar
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">❤️</span>
                  <div>
                    <strong className="text-gray-900">Apoya tu Comunidad</strong>
                    <p className="text-sm text-gray-600">
                      Ayuda a estudiantes mientras ganas dinero
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a la comunidad de FoodLink y disfruta de comida casera cerca de ti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/registro"
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl inline-block"
            >
              Registrarme como Estudiante
            </Link>
            <Link
              href="/vendedor/signup"
              className="bg-green-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl inline-block border-2 border-white"
            >
              Registrarme como Vendedor
            </Link>
          </div>
          <p className="mt-8 text-sm opacity-75">
            📱 Descarga la app próximamente (iOS y Android)
          </p>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Regístrate',
                description: 'Crea tu cuenta como estudiante o vendedor',
                icon: '📝',
              },
              {
                step: '2',
                title: 'Explora Menús',
                description: 'Navega por los menús disponibles cerca de ti',
                icon: '🍽️',
              },
              {
                step: '3',
                title: 'Haz tu Pedido',
                description: 'Selecciona tus platillos favoritos y confirma',
                icon: '🛒',
              },
              {
                step: '4',
                title: 'Disfruta',
                description: 'Recoge o recibe tu comida casera',
                icon: '😋',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-6 bg-gradient-to-br from-primary-50 to-green-50 rounded-xl border-2 border-primary-200"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
