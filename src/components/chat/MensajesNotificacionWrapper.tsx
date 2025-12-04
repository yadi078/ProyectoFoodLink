"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMensajesNoLeidos } from "@/hooks/useMensajesNoLeidos";
import MensajeNotificacion from "./MensajeNotificacion";
import { usePathname } from "next/navigation";

export default function MensajesNotificacionWrapper() {
  const { user, vendedor } = useAuth();
  const pathname = usePathname();

  // Determinar el tipo de usuario
  const tipo = vendedor ? "vendedor" : "estudiante";
  const userId = vendedor ? vendedor.uid : user?.uid;

  const { ultimoMensajeNuevo } = useMensajesNoLeidos(userId, tipo);

  // No mostrar notificación si estamos en la página de mensajes
  const enPaginaMensajes =
    pathname === "/mensajes" || pathname === "/vendedor/mensajes";

  if (!ultimoMensajeNuevo || enPaginaMensajes) {
    return null;
  }

  return (
    <MensajeNotificacion
      nombreRemitente={ultimoMensajeNuevo.nombreRemitente}
      mensaje={ultimoMensajeNuevo.mensaje}
      conversacionId={ultimoMensajeNuevo.conversacionId}
      tipo={tipo}
      onClose={() => {}}
    />
  );
}

