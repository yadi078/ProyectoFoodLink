import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FoodLink - Inicio',
  description: 'Conecta estudiantes con comida casera',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            🍲 FoodLink
          </h1>
          <p className="text-gray-600">
            Conecta estudiantes con comida casera
          </p>
        </div>
<<<<<<< Updated upstream

        <div className="space-y-4">
          <Link
            href="/vendedor/login"
            className="btn-primary block text-center"
          >
            Iniciar Sesión como Vendedor
          </Link>
          <Link
            href="/vendedor/signup"
            className="btn-secondary block text-center"
          >
            Registrarse como Vendedor
          </Link>
=======
        
        {/* Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Cocineros</span>{' '}
            <span className="text-primary-300">Locales</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            Apoya a cocineros de tu comunidad y disfruta de platillos preparados con amor y dedicación
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu" className="bg-primary-500 text-white font-semibold px-8 py-4 rounded-lg hover:bg-primary-600 transition-colors inline-block shadow-lg">
              Ver Menú
            </Link>
            <Link href="/registro" className="bg-green-500 text-white font-semibold px-8 py-4 rounded-lg hover:bg-green-600 transition-colors inline-block shadow-lg">
              Registrarse
            </Link>
          </div>
>>>>>>> Stashed changes
        </div>

<<<<<<< Updated upstream
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ¿Eres estudiante? Próximamente...
          </p>
        </div>
      </div>
=======
      {/* Sobre Nosotros Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1556910096-6f5e72db6803?q=80&w=2000)'
                }}
              ></div>
            </div>

            {/* Right Side - Text Content */}
            <div>
              <p className="text-green-600 font-semibold mb-2">Sobre Nosotros</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Conectando Comunidades
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                FoodLink es una plataforma que conecta cocineros talentosos con estudiantes y personas que buscan comida casera de calidad. Creemos en el poder de la comunidad y en apoyar el talento local.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Nuestra misión es facilitar el acceso a comida deliciosa y nutritiva, mientras apoyamos a cocineros que ponen pasión en cada platillo que preparan.
              </p>
              <Link href="/menu" className="bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors inline-block shadow-md">
                Ver Menú
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Por Qué Elegirnos / Nuestras Características */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Side - Text and Image */}
            <div>
              <p className="text-green-600 font-semibold mb-2">Por Qué Elegirnos</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nuestras Características
            </h2>
              <div className="relative h-[400px] rounded-lg overflow-hidden mb-6">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000)'
                  }}
                ></div>
          </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Conectamos cocineros locales con personas que buscan comida casera de calidad. Nuestra plataforma es fácil de usar y segura.
              </p>
              <Link href="/menu" className="bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors inline-block shadow-md">
                Ver Menú
              </Link>
            </div>

            {/* Right Side - Features */}
            <div className="space-y-6">
              {[
                {
                  icon: '👨‍🍳',
                  title: 'Cocineros Locales',
                  description: 'Conecta con cocineros talentosos de tu comunidad que preparan comida con amor'
                },
                {
                  icon: '🥕',
                  title: 'Ingredientes Frescos',
                  description: 'Todos nuestros cocineros utilizan ingredientes frescos y de calidad'
                },
                {
                  icon: '⭐',
                  title: 'Calidad Garantizada',
                  description: 'Verificamos a todos nuestros cocineros para garantizar la mejor experiencia'
                },
                {
                  icon: '🛒',
                  title: 'Pedidos Fáciles',
                  description: 'Sistema simple para realizar y gestionar tus pedidos de comida'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
          </div>
        </div>
      </section>
>>>>>>> Stashed changes
    </div>
  );
}

