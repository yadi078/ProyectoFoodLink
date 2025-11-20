import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros - FoodLink',
  description: 'Conoce más sobre FoodLink, nuestra misión, visión e historia',
};

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sobre Nosotros
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-green-600 mx-auto rounded"></div>
        </div>

        {/* Misión */}
        <section className="mb-12 bg-gradient-to-br from-primary-50 to-green-50 rounded-xl p-8 border-l-4 border-primary-600">
          <h2 className="text-3xl font-bold text-primary-600 mb-4">
            🎯 Nuestra Misión
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Conectar a estudiantes universitarios con comida casera, nutritiva y
            accesible, mientras apoyamos a familias y microemprendedores locales
            para que puedan generar ingresos adicionales desde sus hogares.
          </p>
        </section>

        {/* Visión */}
        <section className="mb-12 bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl p-8 border-l-4 border-green-600">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            👁️ Nuestra Visión
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ser la plataforma líder en conectar comunidades universitarias con
            opciones de comida casera de calidad, promoviendo la alimentación
            saludable y el apoyo a emprendedores locales en toda España.
          </p>
        </section>

        {/* Historia */}
        <section className="mb-12 bg-white rounded-xl p-8 border-2 border-gray-200 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            📖 Nuestra Historia
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              FoodLink nació de la necesidad de resolver un problema común entre
              estudiantes universitarios: la dificultad para acceder a comida casera,
              nutritiva y económica cerca de sus universidades.
            </p>
            <p>
              Observamos que muchos estudiantes recurren a comida rápida poco
              nutritiva, mientras que familias y microemprendedores locales tienen
              comida deliciosa pero no tienen la visibilidad necesaria para llegar a
              los estudiantes.
            </p>
            <p>
              Decidimos crear una plataforma que conecte ambas partes, beneficiando a
              los estudiantes con comida de calidad y apoyando a los vendedores
              locales.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            💎 Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Calidad',
                description: 'Comida casera fresca y nutritiva',
                icon: '⭐',
                color: 'yellow',
              },
              {
                title: 'Accesibilidad',
                description: 'Precios justos para todos',
                icon: '💰',
                color: 'green',
              },
              {
                title: 'Comunidad',
                description: 'Apoyamos a emprendedores locales',
                icon: '❤️',
                color: 'primary',
              },
            ].map((valor) => (
              <div
                key={valor.title}
                className={`bg-${valor.color}-50 rounded-xl p-6 text-center border-2 border-${valor.color}-200`}
              >
                <div className="text-4xl mb-3">{valor.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {valor.title}
                </h3>
                <p className="text-gray-600">{valor.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo (Opcional) */}
        <section className="bg-gradient-to-br from-primary-100 to-green-100 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            👥 Nuestro Equipo
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Somos un equipo apasionado por la tecnología y la comida, trabajando
            para hacer que la comida casera sea accesible para todos los estudiantes.
          </p>
          <p className="text-gray-600">
            ¿Quieres unirte a nuestro equipo?{' '}
            <a href="/contacto" className="text-primary-600 font-semibold hover:underline">
              Contáctanos
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

