import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FoodLink - Conecta estudiantes con comida casera",
  description:
    "Plataforma que conecta estudiantes universitarios con vendedores de comida casera",
};

export default function HomePage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section - Estilo limpio */}
      <section className="relative w-full bg-[#faf8f5]">
        {/* Welcome Section */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 md:pt-12 lg:pt-16 pb-6 sm:pb-10 md:pb-12">
          {/* Título de bienvenida */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-800 mb-3 sm:mb-6 leading-tight">
              Bienvenidos a <span className="text-primary-500">FoodLink</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Un espacio donde conectamos estudiantes universitarios con
              cocineros locales que preparan comida casera deliciosa y
              nutritiva. Disfruta de platillos únicos preparados con amor y
              dedicación.
            </p>
          </div>

          {/* Imagen principal - tamaño reducido */}
          <div className="relative w-full max-w-5xl mx-auto rounded-lg sm:rounded-2xl overflow-hidden shadow-xl mb-4 sm:mb-8">
            <div className="relative w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2000"
                alt="Cocinero preparando comida casera"
                fill
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex justify-center items-center px-2">
            <Link
              href="/vendedor/login"
              className="btn-secondary text-center shadow-large hover:shadow-xl w-full sm:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Resumido */}
      <section className="relative w-full py-8 sm:py-8 md:py-12 lg:py-16 bg-white/50">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-3xl mx-auto px-4">
          <div className="text-center">
            <div className="mb-3 sm:mb-4 md:mb-5">
              <h2 className="text-primary-500 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display uppercase tracking-wide">
                Sobre Nosotros
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-5 leading-relaxed px-2">
              FoodLink conecta cocineros locales con estudiantes universitarios,
              facilitando el acceso a comida casera de calidad mientras apoyamos
              a microemprendedores locales.
            </p>
            <Link
              href="/sobre-nosotros"
              className="inline-flex items-center text-secondary-500 hover:text-primary-500 font-semibold transition-colors duration-200 text-sm sm:text-base group"
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
      <section className="relative w-full py-8 sm:py-8 md:py-12 lg:py-16 bg-[#f5f1ec]">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4">
          <div className="text-center mb-5 sm:mb-6 md:mb-8">
            <p className="text-primary-500 text-xs sm:text-sm mb-1 sm:mb-2 font-semibold uppercase tracking-wide">
              Por Qué Elegirnos
            </p>
            <h2 className="text-gray-800 text-lg sm:text-2xl md:text-3xl font-bold font-display">
              Nuestras Características
            </h2>
          </div>

          {/* Features Grid - Compacto */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
                  "Pagos en efectivo de forma segura y confiable al recibir tu pedido",
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
                className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 border border-gray-200 hover:border-primary-500 hover:-translate-y-1"
              >
                <div className="text-3xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 text-center">
                  {feature.icon}
                </div>
                <h3 className="text-xs sm:text-lg font-bold font-display mb-1 sm:mb-2 text-center text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-[10px] sm:text-sm text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Categories Section - Estilo plantilla */}
      <section className="relative w-full py-8 sm:py-8 md:py-12 lg:py-16 bg-white/50">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl mx-auto px-4">
          <div className="text-center mb-5 sm:mb-6 md:mb-8">
            <p className="text-primary-500 text-xs sm:text-sm mb-1 sm:mb-2 font-semibold uppercase tracking-wide">
              Nuestras Categorías
            </p>
            <h2 className="text-gray-800 text-lg sm:text-2xl md:text-3xl font-bold font-display">
              Explora Nuestro Menú
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Platillos Principales */}
            <div className="food-item bg-white p-4 sm:p-4 md:p-6 text-center rounded-lg sm:rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 border border-gray-200 hover:border-primary-500 hover:-translate-y-1">
              <div className="text-4xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-primary-500 transition-transform duration-200 group-hover:scale-110">
                🍔
              </div>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold font-display mb-2 sm:mb-3 text-gray-800">
                Platillos Principales
              </h2>
              <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Disfruta de una gran variedad de platillos principales
                preparados con ingredientes frescos y de calidad
              </p>
              <Link
                href="/menu?categoria=Comida rápida"
                className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200 text-xs sm:text-base group"
              >
                Ver Menú
                <span className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </Link>
            </div>

            {/* Postres y Dulces */}
            <div className="food-item bg-white p-4 sm:p-4 md:p-6 text-center rounded-lg sm:rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 border border-gray-200 hover:border-primary-500 hover:-translate-y-1">
              <div className="text-4xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-primary-500 transition-transform duration-200 group-hover:scale-110">
                🍰
              </div>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold font-display mb-2 sm:mb-3 text-gray-800">
                Postres y Dulces
              </h2>
              <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Endulza tu día con deliciosos postres caseros y dulces
                tradicionales preparados con amor
              </p>
              <Link
                href="/menu?categoria=Postres"
                className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200 text-xs sm:text-base group"
              >
                Ver Menú
                <span className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </Link>
            </div>

            {/* Bebidas */}
            <div className="food-item bg-white p-4 sm:p-4 md:p-6 text-center rounded-lg sm:rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 border border-gray-200 hover:border-primary-500 hover:-translate-y-1">
              <div className="text-4xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-primary-500 transition-transform duration-200 group-hover:scale-110">
                🥤
              </div>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold font-display mb-2 sm:mb-3 text-gray-800">
                Bebidas
              </h2>
              <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Refréscate con bebidas naturales, jugos frescos y aguas de sabor
                preparadas artesanalmente
              </p>
              <Link
                href="/menu?categoria=Bebidas"
                className="inline-flex items-center text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200 text-xs sm:text-base group"
              >
                Ver Menú
                <span className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
