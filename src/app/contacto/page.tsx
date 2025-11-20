'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAlert } from '@/components/context/AlertContext';
import { enviarMensajeContacto } from '@/services/contacto/contactoService';

const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('El correo electrónico no es válido'),
  asunto: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  mensaje: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje es demasiado largo'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactoPage() {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      await enviarMensajeContacto({
        nombre: data.nombre,
        email: data.email,
        asunto: data.asunto,
        mensaje: data.mensaje,
      });
      
      showAlert('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
      reset();
    } catch (error: any) {
      showAlert(
        error.message || 'Error al enviar el mensaje. Por favor, intenta de nuevo.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            📧 Contacta con Nosotros
          </h1>
          <p className="text-lg text-gray-600">
            ¿Tienes preguntas o sugerencias? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Información de Contacto */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Información de Contacto
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-4">📧</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a
                    href="mailto:contacto@foodlink.com"
                    className="text-primary-600 hover:underline"
                  >
                    contacto@foodlink.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">📱</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Teléfono</h3>
                  <a
                    href="tel:+34123456789"
                    className="text-primary-600 hover:underline"
                  >
                    +34 123 456 789
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">📍</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Ubicación</h3>
                  <p className="text-gray-600">Disponible en toda España</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">⏰</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Horario de Atención</h3>
                  <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envíanos un Mensaje
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="form-label">
                  Nombre Completo *
                </label>
                <input
                  id="nombre"
                  type="text"
                  className={`form-input ${errors.nombre ? 'form-input-error' : ''}`}
                  placeholder="Juan Pérez"
                  {...register('nombre')}
                />
                {errors.nombre && (
                  <p className="form-error">{errors.nombre.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Correo Electrónico *
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  placeholder="juan@ejemplo.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="asunto" className="form-label">
                  Asunto *
                </label>
                <input
                  id="asunto"
                  type="text"
                  className={`form-input ${errors.asunto ? 'form-input-error' : ''}`}
                  placeholder="¿En qué podemos ayudarte?"
                  {...register('asunto')}
                />
                {errors.asunto && (
                  <p className="form-error">{errors.asunto.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="mensaje" className="form-label">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  rows={6}
                  className={`form-input ${errors.mensaje ? 'form-input-error' : ''}`}
                  placeholder="Escribe tu mensaje aquí..."
                  {...register('mensaje')}
                />
                {errors.mensaje && (
                  <p className="form-error">{errors.mensaje.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

