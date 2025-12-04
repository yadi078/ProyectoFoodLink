"use client";

import { useState, useEffect, useRef } from "react";
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
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActual, setConversacionActual] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Cargar conversaciones
  useEffect(() => {
    if (!user) return;

    const cargarConversaciones = async () => {
      setLoading(true);
      const convs = await getConversacionesEstudiante(user.uid);
      setConversaciones(convs);
      setLoading(false);
    };

    cargarConversaciones();
  }, [user]);

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

    return () => unsubscribe();
  }, [conversacionActual, user]);

  const handleEnviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !conversacionActual || !user) return;

    setEnviando(true);
    try {
      // Obtener nombre del estudiante
      const estudianteNombre = user.displayName || user.email?.split("@")[0] || "Estudiante";

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
      {/* Header */}
      <div className="bg-primary-500 text-white p-3 sm:p-4 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span>💬</span>
          <span>Mensajes</span>
        </h2>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Lista de conversaciones - Mobile First */}
        <div
          className={`${
            conversacionActual ? "hidden sm:block" : "block"
          } w-full sm:w-80 border-r border-gray-200 overflow-y-auto flex-shrink-0`}
        >
          {conversaciones.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              <p className="mb-2">📭</p>
              <p>No tienes conversaciones aún</p>
              <p className="text-xs mt-2">
                Los mensajes con vendedores aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversaciones.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setConversacionActual(conv.id)}
                  className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                    conversacionActual === conv.id ? "bg-primary-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {conv.vendedorNombre[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {conv.vendedorNombre}
                        </p>
                        {conv.noLeidos.estudiante > 0 && (
                          <span className="bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {conv.noLeidos.estudiante}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {conv.ultimoMensaje || "Sin mensajes"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Área de chat */}
        <div className={`flex-1 flex flex-col ${!conversacionActual ? "hidden sm:flex" : "flex"}`}>
          {conversacionActual ? (
            <>
              {/* Header del chat */}
              <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setConversacionActual(null)}
                  className="sm:hidden text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {conversacionSeleccionada?.vendedorNombre[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {conversacionSeleccionada?.vendedorNombre}
                  </p>
                  <p className="text-xs text-gray-500">Vendedor</p>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50">
                {mensajes.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <p>👋</p>
                    <p className="mt-2">Inicia la conversación</p>
                  </div>
                ) : (
                  mensajes.map((msg) => {
                    const esMio = msg.remitenteTipo === "estudiante";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${esMio ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 py-2 ${
                            esMio
                              ? "bg-primary-500 text-white"
                              : "bg-white border border-gray-200 text-gray-800"
                          }`}
                        >
                          <p className="text-sm break-words">{msg.mensaje}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              esMio ? "text-primary-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString("es-MX", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={mensajesEndRef} />
              </div>

              {/* Input de mensaje */}
              <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleEnviarMensaje()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    disabled={enviando}
                  />
                  <button
                    onClick={handleEnviarMensaje}
                    disabled={!nuevoMensaje.trim() || enviando}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {enviando ? "..." : "Enviar"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex flex-1 items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-sm">Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

