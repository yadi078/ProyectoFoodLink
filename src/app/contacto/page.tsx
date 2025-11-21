'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAlert } from '@/components/context/AlertContext';
import { enviarMensajeContacto, getComentariosUsuarios, type MensajeContacto } from '@/services/contacto/contactoService';

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
  const [comentarios, setComentarios] = useState<MensajeContacto[]>([]);
  const [loadingComentarios, setLoadingComentarios] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const cargarComentarios = async () => {
      setLoadingComentarios(true);
      try {
        const comentariosData = await getComentariosUsuarios();
        setComentarios(comentariosData);
      } catch (error: any) {
        console.error('Error cargando comentarios:', error);
      } finally {
        setLoadingComentarios(false);
      }
    };

    cargarComentarios();
  }, []);

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
      
      // Recargar comentarios
      const comentariosData = await getComentariosUsuarios();
      setComentarios(comentariosData);
    } catch (error: any) {
      showAlert(
        error.message || 'Error al enviar el mensaje. Por favor, intenta de nuevo.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatFecha = (fecha: Date) => {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const año = d.getFullYear();
    const horas = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');
    const segundos = String(d.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${año}, ${horas}:${minutos}:${segundos}`;
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Envíanos tus Comentarios
          </h1>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: '📍',
              title: 'Dirección',
              content: 'Ciudad, País'
            },
            {
              icon: '📞',
              title: 'Llámanos',
              content: '+123 456 7890'
            },
            {
              icon: '✉️',
              title: 'Envíanos Email',
              content: 'info@foodlink.com'
            },
            {
              icon: '🔗',
              title: 'Síguenos',
              content: 'Redes sociales'
            }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center border-2 border-gray-200">
              <div className="text-4xl text-primary-600 mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.content}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Formulario de Contacto */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Formulario de Contacto
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="form-label">
                  Tu Nombre *
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
                  Tu Email *
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

          {/* Right Side - Comentarios de Usuarios */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Comentarios de Usuarios
            </h2>
            {loadingComentarios ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando comentarios...</p>
              </div>
            ) : comentarios.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {comentarios.map((comentario) => (
                  <div key={comentario.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{comentario.nombre}</h3>
                      <span className="text-sm text-gray-500">
                        {formatFecha(comentario.fecha)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Asunto:</strong> {comentario.asunto}
                    </p>
                    <p className="text-gray-700 text-sm">{comentario.mensaje}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay comentarios aún.</p>
                <p className="text-gray-500 text-sm mt-2">¡Sé el primero en dejar un comentario!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

