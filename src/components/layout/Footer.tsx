/**
 * Footer Component - Estilo plantilla
 * Pie de página con información, enlaces y newsletter
 */

'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative w-full bg-[rgba(0,0,0,0.04)]">
      <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8 mb-8">
          {/* Left Side - 7 columns */}
          <div className="lg:col-span-7">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Our Address */}
              <div>
                <h2 className="text-2xl font-bold font-display text-[#fbaf32] mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-[#719a0a]">
                  Nuestra Dirección
                </h2>
                <div className="space-y-3">
                  <p className="flex items-start text-[#757575]">
                    <span className="mr-2">📍</span>
                    Disponible en toda España
                  </p>
                  <p className="flex items-start text-[#757575]">
                    <span className="mr-2">📞</span>
                    +34 123 456 789
                  </p>
                  <p className="flex items-start text-[#757575]">
                    <span className="mr-2">📧</span>
                    contacto@foodlink.com
                  </p>
                  <div className="flex gap-3 mt-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#fbaf32] text-white flex items-center justify-center hover:bg-[#719a0a] transition-colors"
                      aria-label="Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#fbaf32] text-white flex items-center justify-center hover:bg-[#719a0a] transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#fbaf32] text-white flex items-center justify-center hover:bg-[#719a0a] transition-colors"
                      aria-label="YouTube"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33zM9.75 15.02V8.98l5.75 3.04-5.75 3z"/>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#fbaf32] text-white flex items-center justify-center hover:bg-[#719a0a] transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#fbaf32] text-white flex items-center justify-center hover:bg-[#719a0a] transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h2 className="text-2xl font-bold font-display text-[#fbaf32] mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-[#719a0a]">
                  Enlaces Rápidos
                </h2>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="text-[#757575] hover:text-[#fbaf32] transition-colors">
                    Inicio
                  </Link>
                  <Link href="/menu" className="text-[#757575] hover:text-[#fbaf32] transition-colors">
                    Menú
                  </Link>
                  <Link href="/sobre-nosotros" className="text-[#757575] hover:text-[#fbaf32] transition-colors">
                    Sobre Nosotros
                  </Link>
                  <Link href="/contacto" className="text-[#757575] hover:text-[#fbaf32] transition-colors">
                    Contacto
                  </Link>
                  <Link href="/preguntas" className="text-[#757575] hover:text-[#fbaf32] transition-colors">
                    Preguntas Frecuentes
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Newsletter - 5 columns */}
          <div className="lg:col-span-5">
            <div>
              <h2 className="text-2xl font-bold font-display text-[#fbaf32] mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-[#719a0a]">
                Newsletter
              </h2>
              <p className="text-[#757575] mb-4">
                Suscríbete a nuestro newsletter para recibir las últimas ofertas y novedades de comida casera cerca de tu universidad.
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Tu email aquí"
                  className="flex-1 px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#fbaf32] focus:border-transparent"
                />
                <button type="submit" className="btn-primary px-4 sm:px-6 py-3 whitespace-nowrap text-sm sm:text-base">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-white py-4">
        <div className="container mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#757575]">
            <p>
              Copyright &copy; <Link href="/" className="text-[#fbaf32] hover:text-[#719a0a]">FoodLink</Link>, Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <a
        href="#"
        className="fixed bottom-[15px] right-[15px] w-11 h-11 bg-[#fbaf32] text-white rounded-[5px] flex items-center justify-center transition-colors hover:bg-[#719a0a] z-[9] hidden lg:flex"
        aria-label="Volver arriba"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </a>
    </footer>
  );
}
