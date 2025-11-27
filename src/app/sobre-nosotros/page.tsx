import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre Nosotros - FoodLink",
  description:
    "Conoce más sobre FoodLink, la plataforma que conecta estudiantes con cocineros locales",
};

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full pt-8 sm:pt-12 md:pt-16 pb-4 sm:pb-6 md:pb-8 bg-white">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-[#fbaf32] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-2">
              Sobre Nosotros
            </h1>
            <p className="text-[#719a0a] text-xl sm:text-2xl md:text-3xl font-semibold font-display">
              Conectando Comunidades Desde 2020
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative w-full py-12 sm:py-16 md:py-[60px]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
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
              <div className="mb-6 sm:mb-8">
                <p className="text-[#719a0a] text-xl mb-2 font-semibold">
                  Nuestra Historia
                </p>
                <h2 className="text-[#fbaf32] text-3xl sm:text-4xl font-bold font-display">
                  ¿Quiénes Somos?
                </h2>
              </div>
              <div className="space-y-4 mb-6">
                <p className="text-base text-[#757575]">
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
      <section className="relative w-full py-12 sm:py-16 md:py-[60px] bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Mission */}
            <div className="bg-white p-6 sm:p-8 rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)]">
              <div className="text-5xl mb-4 text-center">🎯</div>
              <h3 className="text-2xl font-bold font-display mb-4 text-center">
                Nuestra Misión
              </h3>
              <p className="text-[#757575] text-center">
                Facilitar el acceso a comida casera de calidad para estudiantes
                universitarios, mientras apoyamos a cocineros locales y
                microemprendedores que preparan platillos con amor y dedicación.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-6 sm:p-8 rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)]">
              <div className="text-5xl mb-4 text-center">🌟</div>
              <h3 className="text-2xl font-bold font-display mb-4 text-center">
                Nuestra Visión
              </h3>
              <p className="text-[#757575] text-center">
                Ser la plataforma líder en España que conecta comunidades
                universitarias con cocineros locales, creando una red de apoyo
                mutuo y fomentando la economía local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative w-full py-12 sm:py-16 md:py-[60px]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#719a0a] text-xl mb-2 font-semibold">
              Nuestros Valores
            </p>
            <h2 className="text-[#fbaf32] text-3xl sm:text-4xl font-bold font-display">
              Lo Que Nos Define
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
                className="bg-white p-6 rounded-[15px] shadow-[0_0_30px_rgba(0,0,0,0.08)] hover:shadow-lg transition-all text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold font-display mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-[#757575]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-12 sm:py-16 md:py-[60px] bg-[rgba(0,0,0,0.04)]">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-[#fbaf32] text-3xl sm:text-4xl font-bold font-display mb-4">
              ¿Quieres Unirte a Nosotros?
            </h2>
            <p className="text-lg text-[#757575] mb-8 max-w-2xl mx-auto">
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
