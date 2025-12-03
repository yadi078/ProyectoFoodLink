"use client";

import { useState } from "react";
import { useAlert } from "@/components/context/AlertContext";

export default function ContactoPage() {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular envío de formulario
    setTimeout(() => {
      showAlert(
        "¡Gracias por contactarnos! Te responderemos pronto.",
        "success"
      );
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Section */}
      <section className="relative w-full py-6 sm:py-8 md:py-12 bg-[#faf8f5]">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="mb-3 sm:mb-4">
              <h1 className="text-[#719a0a] text-xl sm:text-2xl md:text-3xl mb-2 font-bold font-display flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl">📧</span>
                <span>Contáctanos</span>
              </h1>
              <p className="text-[#FFA552] text-base sm:text-lg md:text-xl font-semibold font-display">
                Estamos Aquí para Ayudarte
              </p>
            </div>
            <p className="text-[#757575] text-sm sm:text-base max-w-2xl mx-auto">
              ¿Tienes alguna pregunta? ¿Necesitas ayuda? No dudes en
              contactarnos. Estamos aquí para ayudarte.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative w-full py-6 sm:py-8 md:py-12 bg-[#f5f1ec]">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Left Side - Contact Info */}
            <div>
              <div className="mb-4 sm:mb-5">
                <p className="text-[#719a0a] text-xs sm:text-sm mb-1.5 font-semibold">
                  Información de Contacto
                </p>
                <h2 className="text-[#FFA552] text-lg sm:text-xl md:text-2xl font-bold font-display">
                  Ponte en Contacto
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="flex items-start">
                  <div className="text-2xl sm:text-2.5xl md:text-3xl mr-3 sm:mr-4">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold font-display mb-1.5 sm:mb-2 text-[#FFA552] text-sm sm:text-base md:text-lg">
                      Dirección
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-[#757575]">
                      Disponible en toda España
                      <br />
                      Servicio en todas las universidades
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl sm:text-2.5xl md:text-3xl mr-3 sm:mr-4">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold font-display mb-1.5 sm:mb-2 text-[#FFA552] text-sm sm:text-base md:text-lg">
                      Teléfono
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-[#757575]">
                      <a
                        href="tel:+34123456789"
                        className="text-[#719a0a] hover:text-[#FFA552] transition-colors font-semibold"
                      >
                        +34 123 456 789
                      </a>
                      <br />
                      Lunes a Viernes: 9:00 - 18:00
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl sm:text-2.5xl md:text-3xl mr-3 sm:mr-4">
                    📧
                  </div>
                  <div>
                    <h3 className="font-bold font-display mb-1.5 sm:mb-2 text-[#FFA552] text-sm sm:text-base md:text-lg">
                      Email
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-[#757575]">
                      <a
                        href="mailto:contacto@foodlink.com"
                        className="text-[#719a0a] hover:text-[#FFA552] transition-colors font-semibold"
                      >
                        contacto@foodlink.com
                      </a>
                      <br />
                      Respondemos en menos de 24 horas
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl sm:text-2.5xl md:text-3xl mr-3 sm:mr-4">
                    💬
                  </div>
                  <div>
                    <h3 className="font-bold font-display mb-1.5 sm:mb-2 text-[#FFA552] text-sm sm:text-base md:text-lg">
                      Redes Sociales
                    </h3>
                    <div className="flex gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                      <a
                        href="#"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFA552] text-white flex items-center justify-center hover:bg-[#719a0a] transition-colors"
                        aria-label="Facebook"
                      >
                        <svg
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFA552] text-white flex items-center justify-center hover:bg-[#719a0a] transition-colors"
                        aria-label="Instagram"
                      >
                        <svg
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
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

            {/* Right Side - Contact Form */}
            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.08)]">
              <div className="mb-3 sm:mb-4">
                <p className="text-[#719a0a] text-xs sm:text-sm mb-1.5 font-semibold">
                  Envíanos un Mensaje
                </p>
                <h2 className="text-[#FFA552] text-lg sm:text-xl md:text-2xl font-bold font-display">
                  Formulario de Contacto
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="form-label">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+34 123 456 789"
                  />
                </div>

                <div>
                  <label htmlFor="asunto" className="form-label">
                    Asunto *
                  </label>
                  <select
                    id="asunto"
                    name="asunto"
                    required
                    value={formData.asunto}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="general">Consulta General</option>
                    <option value="vendedor">Soy Vendedor</option>
                    <option value="estudiante">Soy Estudiante</option>
                    <option value="problema">Reportar un Problema</option>
                    <option value="sugerencia">Sugerencia</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensaje" className="form-label">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    required
                    rows={5}
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full"
                >
                  {isLoading ? "Enviando..." : "Enviar Mensaje"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
