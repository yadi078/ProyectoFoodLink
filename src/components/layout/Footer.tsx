/**
 * Footer Component - Estilo plantilla
 * Pie de página con información, enlaces y newsletter
 */

"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6">
          {/* Our Address */}
          <div className="max-w-md">
            <h2 className="text-lg sm:text-xl font-bold font-display text-primary-500 mb-3 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 sm:after:w-16 after:h-0.5 after:bg-secondary-500 after:rounded-full">
              Contacto
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <p className="flex items-start text-gray-600 text-sm">
                <span className="mr-2 text-base">📍</span>
                <span>Aguascalientes</span>
              </p>
              <p className="flex items-start text-gray-600 text-sm">
                <span className="mr-2 text-base">📞</span>
                <span>465 141 0772</span>
              </p>
              <p className="flex items-start text-gray-600 text-sm">
                <span className="mr-2 text-base">📧</span>
                <span>2236000371@utna.edu.mx</span>
              </p>
              <div className="flex gap-2 mt-3 sm:mt-4">
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-200 shadow-soft hover:shadow-medium hover:scale-105"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-200 shadow-soft hover:shadow-medium hover:scale-105"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33zM9.75 15.02V8.98l5.75 3.04-5.75 3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-200 shadow-soft hover:shadow-medium hover:scale-105"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-white border-t border-gray-200 py-3 sm:py-4">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4">
          <div className="text-center text-gray-600">
            <p className="text-xs sm:text-sm">
              Copyright &copy;{" "}
              <Link
                href="/"
                className="text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200"
              >
                FoodLink
              </Link>
              , Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <a
        href="#"
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 w-10 h-10 sm:w-11 sm:h-11 bg-primary-500 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-primary-600 hover:text-white z-[9] hidden lg:flex shadow-medium hover:shadow-large hover:scale-110"
        aria-label="Volver arriba"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </a>
    </footer>
  );
}
