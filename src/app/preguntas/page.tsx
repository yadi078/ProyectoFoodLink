'use client';

import { useState } from 'react';

const faqs = [
  {
    pregunta: '¿Qué es FoodLink?',
    respuesta: 'FoodLink es una plataforma que conecta cocineros talentosos con estudiantes y personas que buscan comida casera de calidad. Nuestra misión es facilitar el acceso a comida deliciosa y nutritiva, mientras apoyamos a cocineros locales que ponen pasión en cada platillo que preparan.',
  },
  {
    pregunta: '¿Cómo puedo registrarme?',
    respuesta: 'Para registrarte, haz clic en el botón "Registrarse" en la parte superior de la página. Completa el formulario con tu información y selecciona tu tipo de usuario (Estudiante, Cocinero u Otro). Una vez registrado, podrás iniciar sesión y comenzar a usar la plataforma.',
  },
  {
    pregunta: '¿Necesito estar registrado para ver el menú?',
    respuesta: 'No, no necesitas estar registrado para ver el menú. Puedes explorar todos los platillos disponibles en la sección "Menú" sin necesidad de crear una cuenta. Sin embargo, sí necesitarás registrarte e iniciar sesión para hacer pedidos.',
  },
  {
    pregunta: '¿Cómo realizo un pedido?',
    respuesta: 'Para realizar un pedido, primero debes estar registrado e iniciar sesión. Luego, navega a la sección "Menú", selecciona el platillo que deseas, haz clic en "Pedir Ahora" y completa la información del pedido. El cocinero recibirá tu pedido y te contactará para coordinar la entrega.',
  },
  {
    pregunta: '¿Cómo me registro como cocinero?',
    respuesta: 'Para registrarte como cocinero, ve a la página de registro y selecciona la opción "Vendedor" o "Cocinero". Completa el formulario con tu información y espera a que un administrador apruebe tu cuenta. Una vez aprobado, podrás empezar a publicar tus platillos.',
  },
  {
    pregunta: '¿Puedo calificar las comidas?',
    respuesta: 'Sí, después de recibir tu pedido y disfrutar de la comida, puedes calificar y dejar un comentario sobre tu experiencia. Esto ayuda a otros usuarios a conocer la calidad de los platillos y a los cocineros a mejorar sus servicios.',
  },
];

export default function PreguntasPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg text-gray-600">
            Encuentra respuestas a las preguntas más comunes sobre FoodLink
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-lg"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.pregunta}
                </span>
                <span className="text-primary-600 flex-shrink-0">
                  {openIndex === index ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.respuesta}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-6 bg-gradient-to-br from-primary-50 to-green-50 rounded-xl border-2 border-primary-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¿No encontraste tu respuesta?
          </h2>
          <p className="text-gray-700 mb-4">
            Si tienes más preguntas, no dudes en contactarnos. Estamos aquí para ayudarte.
          </p>
          <a
            href="/contacto"
            className="inline-block bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </div>
  );
}

