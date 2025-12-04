"use client";

import ChatEstudiante from "@/components/chat/ChatEstudiante";

export default function MensajesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[calc(100vh-64px)]">
        <ChatEstudiante />
      </div>
    </div>
  );
}

