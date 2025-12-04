"use client";

import VendedorLayout from "@/components/vendedor/VendedorLayout";
import ChatVendedor from "@/components/chat/ChatVendedor";

export default function MensajesVendedorPage() {
  return (
    <VendedorLayout>
      <div className="h-[calc(100vh-120px)]">
        <ChatVendedor />
      </div>
    </VendedorLayout>
  );
}



