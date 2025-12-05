"use client";

import { Suspense } from "react";
import ChatEstudiante from "@/components/chat/ChatEstudiante";

export default function MensajesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando mensajes...</p>
          </div>
        </div>
      }
    >
      <ChatEstudiante />
    </Suspense>
  );
}
