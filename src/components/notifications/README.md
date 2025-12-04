# 🔔 Sistema de Notificaciones - Documentación

## 📁 Archivos en este directorio

### `notificationService.ts`

Servicio principal que maneja toda la lógica de permisos:

- Solicitud de permisos
- Monitoreo de cambios desde el SO
- Gestión de configuración en localStorage
- Límite de rechazos (3 veces / 7 días)

### `NotificationSettings.tsx`

Componente UI completo para gestionar notificaciones:

- Toggle principal
- Mensajes contextuales por estado
- Instrucciones paso a paso
- Preferencias granulares

### `NotificationDebugger.tsx`

Panel de depuración en tiempo real (solo desarrollo):

- Estado actual de permisos
- Contador de rechazos
- Última solicitud

---

## 🎯 Respuestas a las Preguntas Clave

### ¿Cuándo se muestra el mensaje?

✅ **SOLO cuando el usuario hace clic en el toggle** y los permisos están bloqueados

❌ **NUNCA automáticamente** al cargar la página

### ¿Qué pasa si desactiva desde el SO?

✅ **Se detecta en 5 segundos o menos**

✅ **El toggle se desactiva automáticamente**

✅ **El mensaje cambia a "Notificaciones bloqueadas"**

---

## 🧪 Cómo Probar

```bash
# 1. Inicia el servidor
npm run dev

# 2. Ve a configuración
http://localhost:3000/configuracion

# 3. Abre la consola (F12)

# 4. Observa el panel de debug (esquina inferior derecha)

# 5. Haz clic en el toggle de notificaciones

# 6. Desactiva permisos desde el navegador y espera 5 segundos
```

---

## 📊 Logs que verás

```
🔍 Iniciando monitoreo de permisos de notificaciones
👆 Usuario intenta activar notificaciones
✅ Resultado de solicitud de permisos: granted
🎉 Permisos concedidos - Enviando notificación de prueba

[Si desactivas desde el navegador]

🔔 Cambio detectado en permisos: denied
⚠️ Usuario desactivó notificaciones desde el sistema operativo
🔄 Permisos revocados desde el SO - Desactivando notificaciones
```

---

## 🔑 Funciones Principales

### `getNotificationPermission()`

Obtiene el estado actual de permisos del navegador.

### `requestNotificationPermission(userId)`

Solicita permisos al usuario y guarda el resultado.

### `startPermissionMonitoring(userId, callback)`

Inicia monitoreo que verifica cambios cada 5 segundos.

### `checkAndUpdatePermissionState(userId)`

Detecta cambios desde el SO y actualiza la configuración.

### `canRequestPermission(userId)`

Verifica si se puede solicitar permisos (límite de rechazos).

---

## ✅ Garantías

- ✅ El mensaje solo se muestra cuando el usuario intenta activar
- ✅ El sistema detecta cambios desde el SO automáticamente
- ✅ La UI se actualiza sin recargar la página
- ✅ Límite de rechazos para no molestar al usuario
- ✅ Logs claros para depuración
- ✅ Panel de debug en desarrollo

---

## 📖 Documentación Completa

- **Guía de pruebas:** `/PRUEBAS_NOTIFICACIONES.md`
- **Resumen completo:** `/RESUMEN_IMPLEMENTACION_NOTIFICACIONES.md`
