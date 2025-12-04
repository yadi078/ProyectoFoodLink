"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  suscribirseAMensajes,
  enviarMensaje,
  marcarMensajesComoLeidos,
  getConversacionesVendedor,
} from "@/services/chat/chatService";
import type { Conversacion, Mensaje } from "@/lib/firebase/types";

export default function ChatVendedor() {
  const { user, vendedor } = useAuth();
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActual, setConversacionActual] = useState<string | null>(
    null
  );
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Cargar conversaciones
  useEffect(() => {
    if (!vendedor) return;

    const cargarConversaciones = async () => {
      setLoading(true);
      const convs = await getConversacionesVendedor(vendedor.uid);
      setConversaciones(convs);
      setLoading(false);
    };

    cargarConversaciones();

    // Recargar cada 10 segundos
    const interval = setInterval(cargarConversaciones, 10000);
    return () => clearInterval(interval);
  }, [vendedor]);

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
    if (vendedor) {
      marcarMensajesComoLeidos(conversacionActual, "vendedor");
    }

    return () => unsubscribe();
  }, [conversacionActual, vendedor]);

  const handleEnviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !conversacionActual || !vendedor) return;

    setEnviando(true);
    try {
      const vendedorNombre =
        vendedor.nombreNegocio || vendedor.nombre || "Vendedor";

      await enviarMensaje(
        conversacionActual,
        vendedor.uid,
        vendedorNombre,
        "vendedor",
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

  if (!vendedor) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Debes iniciar sesión como vendedor</p>
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
          <span>Mensajes de Clientes</span>
        </h2>
        <p className="text-xs sm:text-sm text-primary-100 mt-1">
          Chatea con tus clientes en tiempo real
        </p>
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
              <p className="mb-2 text-3xl">📭</p>
              <p className="font-semibold">No tienes mensajes aún</p>
              <p className="text-xs mt-2">
                Cuando un cliente te escriba, aparecerá aquí
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
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {conv.estudianteNombre[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {conv.estudianteNombre}
                        </p>
                        {conv.noLeidos.vendedor > 0 && (
                          <span className="bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {conv.noLeidos.vendedor}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {conv.ultimoMensaje || "Sin mensajes"}
                      </p>
                      {conv.pedidoId && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full">
                          📦 Pedido
                        </span>
                      )}
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
              <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setConversacionActual(null)}
                  className="sm:hidden text-gray-600 hover:text-gray-800"
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
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {conversacionSeleccionada?.estudianteNombre[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">
                    {conversacionSeleccionada?.estudianteNombre}
                  </p>
                  <p className="text-xs text-gray-500">Cliente</p>
                </div>
                {conversacionSeleccionada?.pedidoId && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    📦 Pedido #{conversacionSeleccionada.pedidoId.slice(-6)}
                  </span>
                )}
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
                    const esMio = msg.remitenteTipo === "vendedor";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          esMio ? "justify-end" : "justify-start"
                        }`}
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
                            {new Date(msg.createdAt).toLocaleTimeString(
                              "es-MX",
                              {
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
              <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleEnviarMensaje()
                    }
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
                <p className="text-sm font-medium">
                  Selecciona una conversación
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  para comenzar a chatear con tus clientes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
