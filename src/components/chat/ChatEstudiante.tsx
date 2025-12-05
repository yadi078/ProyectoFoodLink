"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  getConversacionesEstudiante,
  crearObtenerConversacion,
  enviarMensaje,
  suscribirseAMensajes,
  marcarMensajesComoLeidos,
} from "@/services/chat/chatService";
import type { Conversacion, Mensaje } from "@/lib/firebase/types";

export default function ChatEstudiante() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActual, setConversacionActual] = useState<string | null>(
    null
  );
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar conversaciones
  useEffect(() => {
    if (!user) return;

    const cargarConversaciones = async () => {
      setLoading(true);
      const convs = await getConversacionesEstudiante(user.uid);
      setConversaciones(convs);
      setLoading(false);

      // Si hay un vendedorId en la URL, abrir/crear conversación automáticamente
      const vendedorId = searchParams.get("vendedorId");
      if (vendedorId) {
        try {
          // Buscar si ya existe una conversación con este vendedor
          const conversacionExistente = convs.find(
            (c) => c.vendedorId === vendedorId
          );

          if (conversacionExistente) {
            // Abrir conversación existente
            setConversacionActual(conversacionExistente.id);
          } else {
            // Crear nueva conversación
            const conversacionId = await crearObtenerConversacion(
              user.uid,
              vendedorId
            );
            setConversacionActual(conversacionId);
            // Recargar conversaciones para incluir la nueva
            const nuevasConvs = await getConversacionesEstudiante(user.uid);
            setConversaciones(nuevasConvs);
          }

          // Auto-enfocar el input después de un pequeño delay
          setTimeout(() => {
            inputRef.current?.focus();
          }, 500);
        } catch (error) {
          console.error("Error abriendo conversación:", error);
        }
      }
    };

    cargarConversaciones();
  }, [user, searchParams]);

  // Suscribirse a mensajes de la conversación actual
  useEffect(() => {
    if (!conversacionActual) return;

    const unsubscribe = suscribirseAMensajes(conversacionActual, (msgs) => {
      setMensajes(msgs);
      // Scroll al final
      setTimeout(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    // Marcar como leídos
    if (user) {
      marcarMensajesComoLeidos(conversacionActual, "estudiante");
    }

    // Auto-enfocar el input cuando se abre una conversación
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => unsubscribe();
  }, [conversacionActual, user]);

  const handleEnviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !conversacionActual || !user) return;

    setEnviando(true);
    try {
      // Obtener nombre del estudiante
      const estudianteNombre =
        user.displayName || user.email?.split("@")[0] || "Estudiante";

      await enviarMensaje(
        conversacionActual,
        user.uid,
        estudianteNombre,
        "estudiante",
        nuevoMensaje
      );
      setNuevoMensaje("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    } finally {
      setEnviando(false);
    }
  };

  const conversacionSeleccionada = conversaciones.find(
    (c) => c.id === conversacionActual
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Inicia sesión para ver tus mensajes</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex overflow-hidden">
        {/* Lista de conversaciones - DISEÑO MODERNO */}
        <div
          className={`${
            conversacionActual ? "hidden sm:block" : "block"
          } w-full sm:w-80 border-r border-gray-200 overflow-y-auto flex-shrink-0 bg-gradient-to-b from-white to-gray-50`}
        >
          {/* Mini header para lista */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span>Chats</span>
            </h2>
          </div>

          {conversaciones.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 rounded-full flex items-center justify-center shadow-inner">
                <span className="text-5xl">📭</span>
              </div>
              <p className="text-base font-bold text-gray-800 mb-2">
                Sin conversaciones
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Contacta a un vendedor desde el menú para iniciar un chat
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversaciones.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setConversacionActual(conv.id)}
                  className={`w-full p-4 text-left transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 ${
                    conversacionActual === conv.id
                      ? "bg-primary-50 hover:bg-primary-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
                        {conv.vendedorNombre[0].toUpperCase()}
                      </div>
                      {conv.noLeidos.estudiante > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center shadow-lg animate-pulse ring-2 ring-white px-1">
                          {conv.noLeidos.estudiante}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-base text-gray-900 truncate pr-2">
                          {conv.vendedorNombre}
                        </p>
                        {conv.ultimoMensajeFecha && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {new Date(
                              conv.ultimoMensajeFecha
                            ).toLocaleDateString("es-MX", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm truncate leading-tight ${
                          conv.noLeidos.estudiante > 0
                            ? "text-gray-900 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {conv.ultimoMensaje || "Inicia la conversación..."}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Área de chat - REDISEÑADO */}
        <div
          className={`flex-1 flex flex-col ${
            !conversacionActual ? "hidden sm:flex" : "flex"
          }`}
        >
          {conversacionActual ? (
            <>
              {/* Header del chat - MÁS ATRACTIVO */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0 shadow-md">
                <button
                  onClick={() => setConversacionActual(null)}
                  className="sm:hidden text-white hover:bg-white/20 rounded-full p-1 transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/30">
                  {conversacionSeleccionada?.vendedorNombre[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base truncate">
                    {conversacionSeleccionada?.vendedorNombre}
                  </p>
                  <p className="text-xs text-white/90 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Vendedor activo
                  </p>
                </div>
              </div>

              {/* Mensajes - FONDO MÁS BONITO */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(113, 154, 10, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(113, 154, 10, 0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundColor: "#fafaf9",
                }}
              >
                {mensajes.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-5xl">👋</span>
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-2">
                        ¡Inicia la conversación!
                      </p>
                      <p className="text-sm text-gray-600">
                        Envía tu primer mensaje al vendedor
                      </p>
                    </div>
                  </div>
                ) : (
                  mensajes.map((msg) => {
                    const esMio = msg.remitenteTipo === "estudiante";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          esMio ? "justify-end" : "justify-start"
                        } animate-fadeIn`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md ${
                            esMio
                              ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-md"
                              : "bg-white text-gray-900 rounded-bl-md shadow-lg"
                          }`}
                        >
                          <p className="text-sm break-words leading-relaxed whitespace-pre-wrap">
                            {msg.mensaje}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <p
                              className={`text-[11px] ${
                                esMio ? "text-white/80" : "text-gray-500"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString(
                                "es-MX",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                            {esMio && (
                              <svg
                                className="w-4 h-4 text-white/80"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={mensajesEndRef} />
              </div>

              {/* Input de mensaje - DISEÑO PREMIUM */}
              <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0 shadow-xl">
                <div className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        handleEnviarMensaje()
                      }
                      placeholder="Escribe tu mensaje..."
                      className="w-full px-5 py-3 text-sm border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 transition-all placeholder:text-gray-400 hover:border-gray-300"
                      disabled={enviando}
                      autoFocus={!!searchParams.get("vendedorId")}
                    />
                  </div>
                  <button
                    onClick={handleEnviarMensaje}
                    disabled={!nuevoMensaje.trim() || enviando}
                    className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-full font-bold hover:from-primary-600 hover:to-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95 disabled:active:scale-100"
                  >
                    {enviando ? (
                      <div className="animate-spin">⏳</div>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 rounded-full flex items-center justify-center shadow-2xl ring-8 ring-white/50">
                  <span className="text-6xl">💬</span>
                </div>
                <p className="text-xl font-bold text-gray-900 mb-2">
                  Selecciona una conversación
                </p>
                <p className="text-base text-gray-600">
                  Elige un vendedor para iniciar el chat
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
