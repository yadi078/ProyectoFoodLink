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
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header compacto con degradado */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white px-3 py-2.5 flex-shrink-0 shadow-md">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span className="text-lg">💬</span>
          <span>Mensajes</span>
        </h2>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Lista de conversaciones */}
        <div
          className={`${
            conversacionActual ? "hidden sm:block" : "block"
          } w-full sm:w-72 border-r border-gray-200 overflow-y-auto flex-shrink-0 bg-white`}
        >
          {conversaciones.length === 0 ? (
            <div className="py-8 px-4 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <span className="text-3xl">📭</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Sin conversaciones
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Contacta a un vendedor para chatear
              </p>
            </div>
          ) : (
            <div>
              {conversaciones.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setConversacionActual(conv.id)}
                  className={`w-full p-3 text-left hover:bg-primary-50 transition-all border-b border-gray-100 ${
                    conversacionActual === conv.id
                      ? "bg-primary-50 border-l-4 border-l-primary-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                        {conv.vendedorNombre[0]}
                      </div>
                      {conv.noLeidos.estudiante > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                          {conv.noLeidos.estudiante}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm text-gray-900 truncate">
                          {conv.vendedorNombre}
                        </p>
                        {conv.noLeidos.estudiante > 0 && (
                          <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                            NUEVO
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs truncate ${
                          conv.noLeidos.estudiante > 0
                            ? "text-gray-900 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {conv.ultimoMensaje || "Comienza la conversación"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Área de chat */}
        <div
          className={`flex-1 flex flex-col ${
            !conversacionActual ? "hidden sm:flex" : "flex"
          }`}
        >
          {conversacionActual ? (
            <>
              {/* Header del chat */}
              <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-3 flex-shrink-0 shadow-sm">
                <button
                  onClick={() => setConversacionActual(null)}
                  className="sm:hidden text-gray-600 hover:text-primary-600 transition-colors"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {conversacionSeleccionada?.vendedorNombre[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">
                    {conversacionSeleccionada?.vendedorNombre}
                  </p>
                  <p className="text-xs text-primary-600 font-medium">
                    Vendedor
                  </p>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-gray-50 to-white">
                {mensajes.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-4xl">👋</span>
                      </div>
                      <p className="text-sm font-bold text-gray-800">
                        ¡Inicia la conversación!
                      </p>
                      <p className="text-xs mt-1 text-gray-500">
                        Envía tu primer mensaje
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
                        }`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-3 py-2 shadow-sm ${
                            esMio
                              ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                              : "bg-white border border-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-sm break-words leading-relaxed">
                            {msg.mensaje}
                          </p>
                          <p
                            className={`text-[10px] mt-1 ${
                              esMio ? "text-primary-100" : "text-gray-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString(
                              "es-MX",
                              {
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={mensajesEndRef} />
              </div>

              {/* Input de mensaje */}
              <div className="border-t border-gray-200 p-2.5 bg-white flex-shrink-0 shadow-lg">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleEnviarMensaje()
                    }
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 transition-all"
                    disabled={enviando}
                    autoFocus={!!searchParams.get("vendedorId")}
                  />
                  <button
                    onClick={handleEnviarMensaje}
                    disabled={!nuevoMensaje.trim() || enviando}
                    className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full font-bold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md hover:shadow-lg active:scale-95"
                  >
                    <span className="text-lg">{enviando ? "⏳" : "📤"}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex flex-1 items-center justify-center bg-gradient-to-b from-gray-50 to-white">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-5xl">💬</span>
                </div>
                <p className="text-base font-bold text-gray-800">
                  Selecciona una conversación
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Elige un vendedor para chatear
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
