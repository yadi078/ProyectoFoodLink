import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sobre Nosotros - FoodLink",
  description:
    "Conoce más sobre FoodLink, la plataforma que conecta estudiantes con cocineros locales",
};

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Section */}
      <section className="relative w-full pt-6 sm:pt-8 md:pt-12 pb-3 sm:pb-4 bg-[#faf8f5]">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-[#FFA552] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display mb-2 flex items-center justify-center gap-2">
              <span className="text-lg sm:text-xl">👥</span>
              <span>Sobre Nosotros</span>
            </h1>
            <p className="text-[#719a0a] text-base sm:text-lg md:text-xl font-semibold font-display">
              Conectando Comunidades Desde 2020
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative w-full py-6 sm:py-8 md:py-12">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
            {/* Left Side - Image */}
            <div className="relative">
              <div className="relative w-full rounded-lg sm:rounded-xl md:rounded-[15px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556910096-6f5e72db6803?q=80&w=2000"
                  alt="Sobre Nosotros"
                  width={2000}
                  height={1333}
                  className="w-full rounded-[15px]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div>
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <p className="text-[#719a0a] text-sm sm:text-base md:text-lg lg:text-xl mb-1.5 sm:mb-2 font-semibold">
                  Nuestra Historia
                </p>
                <h2 className="text-[#FFA552] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display">
                  ¿Quiénes Somos?
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 md:mb-6">
                <p className="text-sm sm:text-base text-[#757575]">
                  FoodLink es una plataforma innovadora que conecta cocineros
                  talentosos con estudiantes universitarios y personas que
                  buscan comida casera de calidad. Creemos en el poder de la
                  comunidad y en apoyar el talento local.
                </p>
                <p className="text-base text-[#757575]">
                  Nuestra misión es facilitar el acceso a comida deliciosa y
                  nutritiva, mientras apoyamos a cocineros que ponen pasión en
                  cada platillo que preparan. Cada orden ayuda a una familia o
                  microemprendedor local a crecer y prosperar.
                </p>
                <p className="text-base text-[#757575]">
                  Fundada en 2020, FoodLink nació de la necesidad de conectar
                  estudiantes universitarios con opciones de comida casera,
                  nutritiva y económica cerca de sus campus.
                </p>
              </div>
              <Link href="/menu" className="btn-primary mt-4 inline-block">
                Ver Menú
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="relative w-full py-8 sm:py-12 md:py-16 lg:py-[60px] bg-[#f5f1ec]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Mission */}
            <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)]">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-center">
                🎯
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display mb-3 sm:mb-4 text-center">
                Nuestra Misión
              </h3>
              <p className="text-sm sm:text-base text-[#757575] text-center">
                Facilitar el acceso a comida casera de calidad para estudiantes
                universitarios, mientras apoyamos a cocineros locales y
                microemprendedores que preparan platillos con amor y dedicación.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)]">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-center">
                🌟
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display mb-3 sm:mb-4 text-center">
                Nuestra Visión
              </h3>
              <p className="text-sm sm:text-base text-[#757575] text-center">
                Ser la plataforma líder en España que conecta comunidades
                universitarias con cocineros locales, creando una red de apoyo
                mutuo y fomentando la economía local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative w-full py-8 sm:py-12 md:py-16 lg:py-[60px]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="text-[#719a0a] text-sm sm:text-base md:text-lg lg:text-xl mb-1.5 sm:mb-2 font-semibold">
              Nuestros Valores
            </p>
            <h2 className="text-[#FFA552] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display">
              Lo Que Nos Define
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {[
              {
                icon: "❤️",
                title: "Pasión",
                description:
                  "Amamos lo que hacemos y creemos en el poder de la comida para unir comunidades",
              },
              {
                icon: "🤝",
                title: "Comunidad",
                description:
                  "Construimos relaciones sólidas entre estudiantes y cocineros locales",
              },
              {
                icon: "✨",
                title: "Calidad",
                description:
                  "Garantizamos ingredientes frescos y platillos preparados con dedicación",
              },
              {
                icon: "🚀",
                title: "Innovación",
                description:
                  "Utilizamos tecnología moderna para facilitar el acceso a comida casera",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl md:rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)] hover:shadow-lg transition-all text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
                  {value.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold font-display mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#757575]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-8 sm:py-12 md:py-16 lg:py-[60px] bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-[#FFA552] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display mb-3 sm:mb-4">
              ¿Quieres Unirte a Nosotros?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#757575] mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto">
              Si eres cocinero y quieres compartir tus platillos con
              estudiantes, o si eres estudiante buscando comida casera, ¡únete a
              nuestra comunidad!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vendedor/signup" className="btn-primary">
                Registrarse como Vendedor
              </Link>
              <Link href="/menu" className="btn-secondary">
                Ver Menú Disponible
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
