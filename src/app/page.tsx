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
              <h1 className="text-center text-white text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold font-display mb-4 sm:mb-6 md:mb-[30px] leading-tight px-2">
                Mejor <span className="text-[#fbaf32]">Calidad</span> de
                Ingredientes
              </h1>
              <p className="text-white text-center text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-[35px] px-2">
                Conectamos estudiantes universitarios con cocineros locales que
                preparan comida casera deliciosa y nutritiva
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-2">
                <Link
                  href="/menu"
                  className="btn-primary text-center text-sm sm:text-base"
                >
                  Ver Menú
                </Link>
                <Link
                  href="/vendedor/signup"
                  className="btn-secondary text-center text-sm sm:text-base"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="relative w-full py-6 sm:py-8 md:py-10 bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#454545] mb-4">
              ¿Quieres ser parte de nuestra comunidad?
            </h2>
            <Link
              href="/vendedor/signup"
              className="btn-primary inline-block text-sm sm:text-base"
            >
              Registrarse como Vendedor
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Resumido */}
      <section className="relative w-full py-6 sm:py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-4">
              <p className="text-[#719a0a] text-lg sm:text-xl mb-2 font-semibold">
                Sobre Nosotros
              </p>
              <h2 className="text-[#fbaf32] text-2xl sm:text-3xl md:text-4xl font-bold font-display">
                Conectando Comunidades Desde 2020
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#757575] mb-4">
              FoodLink conecta cocineros locales con estudiantes universitarios,
              facilitando el acceso a comida casera de calidad mientras apoyamos
              a microemprendedores locales.
            </p>
            <Link
              href="/sobre-nosotros"
              className="text-[#719a0a] hover:text-[#fbaf32] font-semibold transition-colors text-sm sm:text-base"
            >
              Conoce más sobre nosotros →
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section - Compacto */}
      <section className="relative w-full py-6 sm:py-8 md:py-10 bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[#719a0a] text-lg sm:text-xl mb-2 font-semibold">
              Por Qué Elegirnos
            </p>
            <h2 className="text-[#fbaf32] text-2xl sm:text-3xl md:text-4xl font-bold font-display">
              Nuestras Características
            </h2>
          </div>

          {/* Features Grid - Compacto */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                className="bg-white p-4 sm:p-5 rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)] hover:shadow-none transition-all"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 text-center">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold font-display mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#757575] text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Categories Section - Estilo plantilla */}
      <section className="relative w-full py-6 sm:py-8 md:py-10 bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[#719a0a] text-lg sm:text-xl mb-2 font-semibold">
              Nuestras Categorías
            </p>
            <h2 className="text-[#fbaf32] text-2xl sm:text-3xl md:text-4xl font-bold font-display">
              Explora Nuestro Menú
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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
                className="food-item bg-white p-6 sm:p-8 md:p-[50px_30px_30px] text-center rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)] hover:shadow-none transition-all"
              >
                <div className="text-5xl sm:text-6xl mb-4 sm:mb-5 text-[#fbaf32] hover:text-[#719a0a] transition-colors">
                  {item.icon}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display mb-3 sm:mb-4">
                  {item.title}
                </h2>
                <p className="text-sm sm:text-base text-[#757575] mb-4">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="relative text-sm sm:text-base font-semibold text-[#fbaf32] hover:text-[#719a0a] transition-colors"
                >
                  Ver Menú
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
