no# 🧪 Guía de Pruebas - Sistema de Notificaciones

## 📋 Checklist de Funcionalidades a Verificar

### ✅ Requisito 1: El mensaje solo se muestra cuando el usuario intenta activar

- [ ] El mensaje NO aparece automáticamente al cargar la página
- [ ] El mensaje SOLO aparece cuando el usuario hace clic en el toggle de notificaciones
- [ ] El mensaje aparece cuando los permisos están bloqueados

### ✅ Requisito 2: Detección de cambios desde el Sistema Operativo

- [ ] El sistema detecta cuando desactivas permisos desde el navegador
- [ ] El toggle se desactiva automáticamente
- [ ] El mensaje cambia a "Notificaciones bloqueadas"
- [ ] La configuración se guarda correctamente

---

## 🧪 Escenarios de Prueba

### Escenario 1: Primera vez activando notificaciones

**Pasos:**

1. Abre la aplicación y ve a **Configuración** (`/configuracion` o `/vendedor/configuracion`)
2. Observa la sección de **🔔 Notificaciones Push**
3. Haz clic en el **toggle** para activar notificaciones

**Resultado esperado:**

- ✅ El navegador muestra un diálogo solicitando permisos
- ✅ Si ACEPTAS:
  - Aparece mensaje verde "¡Notificaciones activas!"
  - Recibes una notificación de prueba
  - El toggle se activa (verde)
  - Aparecen las preferencias de notificaciones
- ✅ Si BLOQUEAS:
  - Aparece mensaje rojo "Notificaciones bloqueadas"
  - Se muestran instrucciones paso a paso
  - El toggle NO se activa

**Consola del navegador (F12):**

```
👆 Usuario intenta activar notificaciones
✅ Resultado de solicitud de permisos: granted
🎉 Permisos concedidos - Enviando notificación de prueba
```

---

### Escenario 2: Usuario rechaza permisos desde el diálogo

**Pasos:**

1. Ve a Configuración
2. Haz clic en el toggle de notificaciones
3. En el diálogo del navegador, haz clic en **Bloquear** o **X**

**Resultado esperado:**

- ✅ Aparece mensaje rojo: "Notificaciones bloqueadas"
- ✅ Se muestran instrucciones con pasos para activar desde el navegador
- ✅ El toggle permanece desactivado (gris)
- ✅ Contador de rechazos incrementa (visible en el debugger)

**Consola del navegador:**

```
👆 Usuario intenta activar notificaciones
✅ Resultado de solicitud de permisos: denied
❌ Permisos denegados - Mostrando instrucciones
```

---

### Escenario 3: Usuario desactiva notificaciones desde el navegador (⭐ CRÍTICO)

**Pasos:**

1. Primero, activa las notificaciones normalmente (permisos concedidos)
2. Verifica que el toggle esté ACTIVADO (verde)
3. **SIN cerrar la página**, ve a los ajustes del navegador:
   - Chrome: Haz clic en el 🔒 candado → Configuración del sitio → Notificaciones → Bloquear
   - Firefox: Haz clic en el 🔒 candado → Permisos → Notificaciones → Bloquear
   - Edge: Similar a Chrome
4. Espera 5 segundos (o menos)

**Resultado esperado:**

- ✅ **SIN recargar la página**, el toggle se desactiva automáticamente
- ✅ El mensaje cambia de verde a rojo
- ✅ Aparece: "Notificaciones bloqueadas" con instrucciones
- ✅ Las preferencias de notificaciones desaparecen
- ✅ El estado se guarda en localStorage

**Consola del navegador:**

```
🔔 Cambio detectado en permisos: denied
⚠️ Usuario desactivó notificaciones desde el sistema operativo
🔄 Permisos revocados desde el SO - Desactivando notificaciones
```

**Panel de Debug (esquina inferior derecha):**

```
Estado Browser: denied
Activado App: NO
```

---

### Escenario 4: Usuario reactiva notificaciones desde el navegador

**Pasos:**

1. Con las notificaciones bloqueadas, ve a los ajustes del navegador
2. Cambia el permiso de "Bloquear" a "Permitir"
3. Espera 5 segundos

**Resultado esperado:**

- ✅ El mensaje cambia de rojo a azul (estado "default" o "granted")
- ✅ El usuario puede volver a activar el toggle
- ✅ Se pueden solicitar permisos nuevamente

**Consola del navegador:**

```
🔔 Cambio detectado en permisos: granted
🔄 Permisos concedidos desde el SO - Activando notificaciones
```

---

### Escenario 5: Límite de rechazos (3 veces)

**Pasos:**

1. Intenta activar notificaciones y RECHAZA
2. Recarga la página
3. Intenta activar notificaciones y RECHAZA (segunda vez)
4. Recarga la página
5. Intenta activar notificaciones y RECHAZA (tercera vez)
6. Recarga la página
7. Intenta activar notificaciones (cuarta vez)

**Resultado esperado:**

- ✅ En el cuarto intento, NO se muestra el diálogo del navegador
- ✅ Aparecen las instrucciones inmediatamente
- ✅ El debugger muestra "Rechazos: 3 / 3"

**Consola del navegador:**

```
👆 Usuario intenta activar notificaciones
⏰ Límite de rechazos alcanzado - Mostrando instrucciones
```

---

### Escenario 6: Preferencias individuales de notificaciones

**Pasos:**

1. Activa las notificaciones (permisos concedidos)
2. Verifica que aparezcan las preferencias:
   - Pedidos nuevos
   - Actualizaciones de pedidos
   - Mensajes de vendedores
   - Promociones y ofertas
3. Desactiva/activa cada una

**Resultado esperado:**

- ✅ Cada toggle funciona independientemente
- ✅ Los cambios se guardan en localStorage
- ✅ Al recargar la página, las preferencias se mantienen

---

### Escenario 7: Múltiples pestañas abiertas

**Pasos:**

1. Abre la página de configuración en dos pestañas
2. En la primera pestaña, activa notificaciones
3. Cambia los permisos desde el navegador

**Resultado esperado:**

- ✅ Ambas pestañas detectan el cambio en 5 segundos
- ✅ Ambas actualizan su UI sincronizadamente

---

## 🐛 Panel de Debug

En la esquina **inferior derecha** verás un panel negro con información en tiempo real:

```
🐛 Debug Notificaciones         19:45:32
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado Browser:        granted
Activado App:          SÍ
Rechazos:              0 / 3
Última solicitud:      19:43:15

💡 Para probar: Activa/desactiva notificaciones
desde los ajustes del navegador y observa los cambios.
```

**Estados posibles:**

- `default` (amarillo): Usuario no ha decidido
- `granted` (verde): Permisos concedidos
- `denied` (rojo): Permisos bloqueados
- `unsupported`: Navegador no soporta notificaciones

---

## 🔍 Verificación Manual en la Consola del Navegador

Puedes verificar el estado manualmente:

### Ver estado actual de permisos:

```javascript
console.log("Estado:", Notification.permission);
// 'default', 'granted', o 'denied'
```

### Ver configuración guardada:

```javascript
// Reemplaza 'USER_ID' con tu ID de usuario real
const userId = "TU_USER_ID_AQUI";
const settings = localStorage.getItem(`notification_settings_${userId}`);
console.log("Configuración:", JSON.parse(settings));
```

### Simular solicitud de permisos:

```javascript
Notification.requestPermission().then((result) => {
  console.log("Resultado:", result);
});
```

---

## 📊 Checklist Final de Verificación

Antes de considerar la funcionalidad completa, verifica que:

- [ ] ✅ El mensaje "Activa las notificaciones desde los ajustes del sistema" SOLO aparece cuando:
  - El usuario hace clic en el toggle
  - Los permisos están en estado 'denied'
- [ ] ✅ El mensaje NO aparece:

  - Al cargar la página
  - Automáticamente
  - Sin interacción del usuario

- [ ] ✅ El sistema detecta cambios desde el SO:

  - Monitoreo cada 5 segundos funciona
  - UI se actualiza sin recargar página
  - Se muestra en consola: "🔄 Permisos revocados desde el SO"

- [ ] ✅ El toggle se comporta correctamente:

  - Verde solo cuando permisos = granted Y settings.enabled = true
  - Gris cuando permisos = denied
  - Deshabilitado cuando permisos = denied

- [ ] ✅ Las instrucciones son claras:

  - Pasos específicos para activar desde el navegador
  - Botón "Entendido" para cerrar

- [ ] ✅ Notificación de prueba funciona:

  - Se envía al activar por primera vez
  - Contiene el texto: "¡Las notificaciones están activas! 🎉"

- [ ] ✅ Límite de rechazos funciona:
  - Después de 3 rechazos, espera 7 días
  - Se muestra mensaje apropiado

---

## 🎯 Prueba Rápida (5 minutos)

1. ✅ **Carga la página** → Verifica que NO aparezca el mensaje automáticamente
2. ✅ **Haz clic en toggle** → Verifica que se soliciten permisos
3. ✅ **Acepta permisos** → Verifica notificación de prueba
4. ✅ **Desactiva desde navegador** → Verifica que se detecte el cambio (espera 5 seg)
5. ✅ **Observa la consola** → Verifica que aparezcan los logs correctos

---

## 🚨 Problemas Conocidos y Soluciones

### El monitoreo no funciona

**Solución:** Verifica que el componente esté montado y que no haya errores en consola

### El toggle no se desactiva al bloquear desde el navegador

**Solución:** Espera al menos 5 segundos (intervalo de verificación)

### La notificación de prueba no aparece

**Solución:** Verifica que el navegador permita notificaciones y que no esté en modo "No molestar"

---

## 📝 Notas Importantes

- El panel de debug **SOLO se muestra en desarrollo** (no en producción)
- Los logs en consola ayudan a entender el flujo completo
- El monitoreo se detiene automáticamente al desmontar el componente
- La configuración se guarda por usuario en `localStorage`

---

## ✅ Confirmación Final

Una vez completadas todas las pruebas, confirma que:

1. ✅ **"¿Cuándo se muestra el mensaje?"**

   - Solo cuando el usuario intenta activar manualmente
   - Solo si los permisos están bloqueados
   - NO automáticamente ni repetidamente

2. ✅ **"¿Qué pasa si desactiva desde el SO?"**
   - Se detecta automáticamente en ≤5 segundos
   - UI se actualiza sin recargar
   - Configuración se guarda correctamente
   - Se muestra mensaje apropiado

---

**¿Todo funciona correctamente? ¡Excelente!** 🎉

El sistema de notificaciones está implementado profesionalmente con:

- ✅ Manejo robusto de permisos
- ✅ Detección automática de cambios
- ✅ UX no intrusiva
- ✅ Límite de solicitudes
- ✅ Logs de depuración completos
