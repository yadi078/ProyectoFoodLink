import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FoodLink - Conecta estudiantes con comida casera",
  description:
    "Plataforma que conecta estudiantes universitarios con vendedores de comida casera",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero/Carousel Section - Estilo plantilla */}
      <section className="relative w-full h-screen min-h-[400px]">
        <div className="absolute inset-0">
          {/* Carousel Item 1 */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="absolute inset-0 w-full h-full text-right overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2000)",
                }}
              ></div>
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] z-[1]"></div>
            </div>

            <div className="relative z-[2] max-w-[700px] h-screen flex items-center justify-center flex-col px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-28">
              <h1 className="text-center text-white text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold font-display mb-6 sm:mb-8 md:mb-10 leading-tight px-2 drop-shadow-lg">
                Mejor <span className="text-secondary-500">Calidad</span> de
                Ingredientes
              </h1>
              <p className="text-white/95 text-center text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 md:mb-12 px-2 leading-relaxed drop-shadow-md">
                Conectamos estudiantes universitarios con cocineros locales que
                preparan comida casera deliciosa y nutritiva
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-2">
                <Link
                  href="/menu"
                  className="btn-primary text-center text-sm sm:text-base shadow-large hover:shadow-xl"
                >
                  Ver Menú
                </Link>
                <Link
                  href="/vendedor/signup"
                  className="btn-secondary text-center text-sm sm:text-base shadow-large hover:shadow-xl"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="relative w-full py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-800 mb-6">
              ¿Quieres ser parte de nuestra comunidad?
            </h2>
            <Link
              href="/vendedor/signup"
              className="btn-primary inline-block text-sm sm:text-base shadow-medium hover:shadow-large"
            >
              Registrarse como Vendedor
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Resumido */}
      <section className="relative w-full py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <p className="text-primary-500 text-base sm:text-lg mb-3 font-semibold uppercase tracking-wide">
                Sobre Nosotros
              </p>
              <h2 className="text-primary-500 text-2xl sm:text-3xl md:text-4xl font-bold font-display">
                Conectando Comunidades Desde 2020
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
              FoodLink conecta cocineros locales con estudiantes universitarios,
              facilitando el acceso a comida casera de calidad mientras apoyamos
              a microemprendedores locales.
            </p>
            <Link
              href="/sobre-nosotros"
              className="inline-flex items-center text-secondary-500 hover:text-primary-500 font-semibold transition-colors duration-200 text-base sm:text-lg group"
            >
              Conoce más sobre nosotros
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section - Compacto */}
      <section className="relative w-full py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-primary-500 text-base sm:text-lg mb-3 font-semibold uppercase tracking-wide">
              Por Qué Elegirnos
            </p>
            <h2 className="text-gray-800 text-2xl sm:text-3xl md:text-4xl font-bold font-display">
              Nuestras Características
            </h2>
          </div>

          {/* Features Grid - Compacto */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "👨‍🍳",
                title: "Cocineros Locales",
                description:
                  "Conecta con cocineros talentosos de tu comunidad que preparan comida con amor y dedicación",
              },
              {
                icon: "🥕",
                title: "Ingredientes Frescos",
                description:
                  "Todos nuestros cocineros utilizan ingredientes frescos y de la más alta calidad",
              },
              {
                icon: "⭐",
                title: "Calidad Garantizada",
                description:
                  "Verificamos a todos nuestros cocineros para garantizar la mejor experiencia",
              },
              {
                icon: "🚚",
                title: "Entrega Rápida",
                description:
                  "Sistema eficiente de entrega o recolección cerca de tu universidad",
              },
              {
                icon: "💳",
                title: "Pagos Seguros",
                description:
                  "Plataforma segura con múltiples métodos de pago disponibles",
              },
              {
                icon: "❤️",
                title: "Apoyo Comunitario",
                description:
                  "Cada orden ayuda a familias y microemprendedores locales a crecer",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-200 border border-gray-200 hover:border-primary-500 hover:-translate-y-1"
              >
                <div className="text-4xl sm:text-5xl mb-4 text-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display mb-3 text-center text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Categories Section - Estilo plantilla */}
      <section className="relative w-full py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-primary-500 text-base sm:text-lg mb-3 font-semibold uppercase tracking-wide">
              Nuestras Categorías
            </p>
            <h2 className="text-gray-800 text-2xl sm:text-3xl md:text-4xl font-bold font-display">
              Explora Nuestro Menú
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: "🍔",
                title: "Platillos Principales",
                description:
                  "Disfruta de una gran variedad de platillos principales preparados con ingredientes frescos y de calidad",
                link: "/menu",
              },
              {
                icon: "🍰",
                title: "Postres y Dulces",
                description:
                  "Endulza tu día con deliciosos postres caseros y dulces tradicionales preparados con amor",
                link: "/menu",
              },
              {
                icon: "🥤",
                title: "Bebidas",
                description:
                  "Refréscate con bebidas naturales, jugos frescos y aguas de sabor preparadas artesanalmente",
                link: "/menu",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="food-item bg-white p-8 sm:p-10 text-center rounded-2xl shadow-soft hover:shadow-medium transition-all duration-200 border border-gray-200 hover:border-primary-500 hover:-translate-y-2"
              >
                <div className="text-6xl sm:text-7xl mb-6 text-primary-500 transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4 text-gray-800">
                  {item.title}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200 text-base sm:text-lg group"
                >
                  Ver Menú
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
