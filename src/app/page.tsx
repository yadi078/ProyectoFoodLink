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
      <section className="relative w-full h-screen min-h-[400px] bg-white">
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

            <div className="relative z-[2] max-w-[700px] h-[calc(100vh-35px)] flex items-center justify-center flex-col px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-28">
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

      {/* Booking Section - Estilo plantilla */}
      <section className="relative w-full mb-8 sm:mb-12 md:mb-[45px] bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center py-8 sm:py-12 md:py-[45px]">
            {/* Left Side - Content */}
            <div className="booking-content py-6 sm:py-8 md:py-[45px] lg:py-0">
              <div className="section-header mb-6 sm:mb-8 md:mb-[30px]">
                <p>Únete a Nosotros</p>
                <h2>
                  Conéctate con Cocineros Locales y Disfruta de Comida Casera
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-base text-[#757575]">
                  FoodLink es una plataforma innovadora que conecta estudiantes
                  universitarios con familias y microemprendedores locales que
                  preparan comida casera deliciosa y nutritiva.
                </p>
                <p className="text-base text-[#757575]">
                  Nuestra misión es facilitar el acceso a comida de calidad
                  mientras apoyamos a cocineros locales que ponen pasión y
                  dedicación en cada platillo que preparan. Únete a nuestra
                  comunidad y disfruta de sabores únicos cerca de tu
                  universidad.
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="booking-form p-6 sm:p-8 md:p-[60px_30px] bg-[#fbaf32] rounded-lg lg:rounded-none">
              <form>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full h-[45px] px-4 text-sm text-white border border-white rounded-[5px] bg-transparent placeholder-white placeholder-opacity-100"
                      placeholder="Nombre"
                      required
                    />
                    <i className="absolute top-[15px] right-[15px] text-white text-sm">
                      👤
                    </i>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full h-[45px] px-4 text-sm text-white border border-white rounded-[5px] bg-transparent placeholder-white"
                      placeholder="Email"
                      required
                    />
                    <i className="absolute top-[15px] right-[15px] text-white text-sm">
                      📧
                    </i>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full h-[45px] px-4 text-sm text-white border border-white rounded-[5px] bg-transparent placeholder-white"
                      placeholder="Teléfono"
                      required
                    />
                    <i className="absolute top-[15px] right-[15px] text-white text-sm">
                      📱
                    </i>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full btn-primary bg-white text-[#fbaf32] border-white hover:bg-transparent hover:text-white text-sm sm:text-base"
                  >
                    Registrarse Ahora
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Estilo plantilla */}
      <section className="relative w-full py-8 sm:py-12 md:py-[45px]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            {/* Left Side - Image */}
            <div className="relative">
              <div className="relative w-full rounded-[15px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556910096-6f5e72db6803?q=80&w=2000"
                  alt="Sobre Nosotros"
                  className="w-full rounded-[15px]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div>
              <div className="section-header mb-6 sm:mb-8 md:mb-[30px]">
                <p>Sobre Nosotros</p>
                <h2>Conectando Comunidades Desde 2024</h2>
              </div>
              <div className="space-y-4 mb-6">
                <p className="text-base text-[#757575]">
                  FoodLink es una plataforma que conecta cocineros talentosos
                  con estudiantes y personas que buscan comida casera de
                  calidad. Creemos en el poder de la comunidad y en apoyar el
                  talento local.
                </p>
                <p className="text-base text-[#757575]">
                  Nuestra misión es facilitar el acceso a comida deliciosa y
                  nutritiva, mientras apoyamos a cocineros que ponen pasión en
                  cada platillo que preparan. Cada orden ayuda a una familia o
                  microemprendedor local.
                </p>
              </div>
              <Link href="/menu" className="btn-primary mt-4 inline-block">
                Ver Menú
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section - Estilo plantilla */}
      <section className="relative w-full py-8 sm:py-12 md:py-[45px] bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Left Side */}
            <div>
              <div className="section-header mb-6 sm:mb-8 md:mb-[30px]">
                <p>Por Qué Elegirnos</p>
                <h2>Nuestras Características</h2>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400"
                  alt="Feature 1"
                  className="w-full rounded-[15px]"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400"
                  alt="Feature 2"
                  className="w-full rounded-[15px]"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400"
                  alt="Feature 3"
                  className="w-full rounded-[15px]"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=400"
                  alt="Feature 4"
                  className="w-full rounded-[15px]"
                  loading="lazy"
                />
              </div>

              <p className="text-base text-[#757575] mb-6">
                Conectamos cocineros locales con personas que buscan comida
                casera de calidad. Nuestra plataforma es fácil de usar, segura y
                está diseñada para apoyar tanto a estudiantes como a vendedores.
              </p>
              <Link href="/menu" className="btn-primary inline-block">
                Ver Menú
              </Link>
            </div>

            {/* Right Side - Features */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
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
                  className="bg-white p-4 sm:p-6 rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)] hover:shadow-none transition-all"
                >
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-display mb-2 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#757575] text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Food Categories Section - Estilo plantilla */}
      <section className="relative w-full py-12 sm:py-16 md:py-[90px] my-8 sm:my-12 md:my-[45px] bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
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

      {/* Menu Section - Estilo plantilla con pestañas */}
      <section className="relative w-full py-8 sm:py-12 md:py-[45px]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-8 sm:mb-12">
            <p>Menú de Comida</p>
            <h2>Delicioso Menú</h2>
          </div>

          {/* Menu Tabs */}
          <div className="menu-tab">
            <ul className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
              <li>
                <a
                  href="#principales"
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-[#fbaf32] text-white rounded-[5px] font-display font-semibold"
                >
                  Principales
                </a>
              </li>
              <li>
                <a
                  href="#postres"
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-[5px] font-display font-semibold hover:bg-[#fbaf32] hover:text-white transition-colors"
                >
                  Postres
                </a>
              </li>
              <li>
                <a
                  href="#bebidas"
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-[5px] font-display font-semibold hover:bg-[#fbaf32] hover:text-white transition-colors"
                >
                  Bebidas
                </a>
              </li>
            </ul>

            {/* Menu Content */}
            <div id="principales" className="menu-content">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {[
                    {
                      name: "Pollo a la Plancha",
                      price: "$45.00",
                      desc: "Pollo asado con arroz y ensalada",
                    },
                    {
                      name: "Tacos de Carne Asada",
                      price: "$35.00",
                      desc: "Tacos tradicionales con guacamole",
                    },
                    {
                      name: "Pasta Carbonara",
                      price: "$50.00",
                      desc: "Pasta cremosa con tocino y queso",
                    },
                    {
                      name: "Enchiladas Verdes",
                      price: "$40.00",
                      desc: "Enchiladas con pollo y crema",
                    },
                    {
                      name: "Pizza Casera",
                      price: "$55.00",
                      desc: "Pizza artesanal con ingredientes frescos",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)] hover:shadow-lg transition-all"
                    >
                      <img
                        src={`https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=100&h=100&fit=crop&sig=${index}`}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-[15px] object-cover flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold font-display">
                          <span className="block sm:inline">{item.name}</span>{" "}
                          <strong className="text-[#fbaf32] block sm:float-right sm:inline mt-1 sm:mt-0">
                            {item.price}
                          </strong>
                        </h3>
                        <p className="text-xs sm:text-sm text-[#757575] mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden lg:block">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600"
                    alt="Menú Principal"
                    className="w-full h-full object-cover rounded-[15px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Estilo plantilla */}
      <section className="relative w-full py-8 sm:py-12 md:py-[45px] bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="section-header text-center mb-8 sm:mb-12">
            <p>Nuestro Equipo</p>
            <h2>Cocineros Destacados</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                name: "María González",
                role: "Cocinera Principal",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
              },
              {
                name: "José Martínez",
                role: "Especialista en Carnes",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
              },
              {
                name: "Ana Rodríguez",
                role: "Especialista en Postres",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
              },
              {
                name: "Carlos Sánchez",
                role: "Chef Ejecutivo",
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
              },
            ].map((chef, index) => (
              <div
                key={index}
                className="bg-white rounded-[15px] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.08)] hover:shadow-lg transition-all"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-6 text-center">
                  <h3 className="text-lg sm:text-xl font-bold font-display mb-1">
                    {chef.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#757575]">
                    {chef.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
