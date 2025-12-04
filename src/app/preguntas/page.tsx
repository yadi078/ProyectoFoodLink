"use client";

import { useState } from "react";

export default function PreguntasPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "¿Qué es FoodLink?",
          answer:
            "FoodLink es una plataforma que conecta estudiantes universitarios con cocineros locales que preparan comida casera deliciosa y nutritiva. Facilitamos el acceso a comida de calidad mientras apoyamos a microemprendedores locales.",
        },
        {
          question: "¿Cómo funciona FoodLink?",
          answer:
            "Los cocineros registran sus platillos en la plataforma y los estudiantes pueden explorar el menú disponible, hacer pedidos y elegir entre recolección o entrega. Todo se gestiona de forma sencilla a través de nuestra plataforma web.",
        },
        {
          question: "¿Es seguro usar FoodLink?",
          answer:
            "Sí, utilizamos Firebase Authentication para garantizar la seguridad de las cuentas y Firestore para almacenar la información de forma segura. Todos los pagos y transacciones se manejan de forma segura.",
        },
      ],
    },
    {
      category: "Para Estudiantes",
      questions: [
        {
          question: "¿Cómo puedo hacer un pedido?",
          answer:
            "Primero necesitas registrarte o iniciar sesión. Luego, explora el menú disponible, selecciona los platillos que deseas y completa tu pedido. Puedes elegir entre recolección o entrega.",
        },
        {
          question: "¿Cuáles son los métodos de pago?",
          answer:
            "Actualmente aceptamos pagos en efectivo al momento de la entrega o recolección. Estamos trabajando en integrar métodos de pago en línea.",
        },
        {
          question: "¿Puedo cancelar mi pedido?",
          answer:
            "Sí, puedes cancelar tu pedido antes de que el cocinero comience a prepararlo. Contacta directamente con el vendedor o a través de la plataforma.",
        },
        {
          question: "¿Hay un mínimo de pedido?",
          answer:
            "Esto depende de cada vendedor. Algunos cocineros pueden tener un mínimo de pedido, que se indicará en su perfil.",
        },
      ],
    },
    {
      category: "Para Vendedores",
      questions: [
        {
          question: "¿Cómo me registro como vendedor?",
          answer:
            "Haz clic en 'Registrarse' en el menú principal, completa el formulario con tu información y crea tu cuenta. Una vez registrado, podrás agregar tus platillos al menú.",
        },
        {
          question: "¿Cuánto cuesta usar FoodLink?",
          answer:
            "Actualmente, FoodLink es gratuito para vendedores. No cobramos comisiones por los pedidos. Esto puede cambiar en el futuro, pero siempre te notificaremos con anticipación.",
        },
        {
          question: "¿Cómo agrego platillos a mi menú?",
          answer:
            "Una vez que inicies sesión, ve a tu panel de vendedor donde podrás agregar, editar y gestionar tus platillos. Puedes incluir nombre, descripción, precio, imagen y disponibilidad.",
        },
        {
          question: "¿Cómo recibo los pedidos?",
          answer:
            "Los pedidos aparecerán en tu panel de vendedor. Recibirás notificaciones cuando un estudiante haga un pedido. Puedes aceptar o rechazar pedidos según tu disponibilidad.",
        },
        {
          question: "¿Puedo establecer mis propios precios?",
          answer:
            "Sí, tú decides los precios de tus platillos. Puedes actualizarlos en cualquier momento desde tu panel de vendedor.",
        },
      ],
    },
    {
      category: "Entrega y Recolección",
      questions: [
        {
          question: "¿Ofrecen entrega a domicilio?",
          answer:
            "Depende de cada vendedor. Algunos ofrecen entrega a domicilio, mientras que otros solo ofrecen recolección. Esto se indica en el perfil de cada vendedor.",
        },
        {
          question: "¿Cuánto tiempo tarda la entrega?",
          answer:
            "El tiempo de entrega varía según el vendedor y la ubicación. Generalmente, los pedidos se preparan y entregan el mismo día. El vendedor te indicará el tiempo estimado.",
        },
        {
          question: "¿Dónde puedo recoger mi pedido?",
          answer:
            "La ubicación de recolección se acordará con el vendedor. Puede ser en un punto de encuentro cerca de la universidad o en la ubicación del vendedor.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-8 sm:py-12 md:py-16 bg-gradient-to-b from-[#FFA552] to-[#ff9933]">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl mx-auto px-4">
          <div className="text-center text-white">
            <div className="mb-4 sm:mb-5">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-2 flex items-center justify-center gap-2">
                <span>❓</span>
                <span>¿Tienes Preguntas?</span>
              </h1>
              <p className="text-white text-lg sm:text-xl">
                Preguntas Frecuentes
              </p>
            </div>
            <p className="text-sm sm:text-base max-w-2xl mx-auto opacity-90">
              Encuentra respuestas a las preguntas más comunes sobre FoodLink
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative w-full py-6 sm:py-8 md:py-12">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl mx-auto px-4">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold font-display mb-4 sm:mb-5 text-[#454545]">
                {category.category}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {category.questions.map((faq, index) => {
                  const globalIndex =
                    faqs
                      .slice(0, categoryIndex)
                      .reduce((acc, cat) => acc + cat.questions.length, 0) +
                    index;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold font-display text-sm sm:text-base text-[#454545]">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-5 h-5 text-[#FFA552] transition-transform ${
                            isOpen ? "transform rotate-180" : ""
                          }`}
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
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-200">
                          <p className="text-sm text-[#757575] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="relative w-full py-6 sm:py-8 md:py-12 bg-[rgba(0,0,0,0.04)]">
        <div className="max-w-[450px] sm:max-w-2xl md:max-w-4xl mx-auto px-4">
          <div className="text-center bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.08)]">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display mb-3 sm:mb-4">
              ¿No Encontraste tu Respuesta?
            </h2>
            <p className="text-sm sm:text-base text-[#757575] mb-4 sm:mb-5">
              Si tienes más preguntas, no dudes en contactarnos. Estamos aquí
              para ayudarte.
            </p>
            <a href="/contacto" className="btn-primary inline-block">
              Contáctanos
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
