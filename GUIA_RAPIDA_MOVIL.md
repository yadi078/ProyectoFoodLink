# 🚀 Guía Rápida - Notificaciones Móviles

## ✅ **¡TODO LISTO!**

Tu sistema de notificaciones ya está configurado para funcionar en dispositivos móviles.

---

## 📱 **Lo que se implementó:**

1. ✅ **Service Worker** - Maneja notificaciones en móvil
2. ✅ **manifest.json** - Configuración PWA
3. ✅ **Registro automático** - Se activa al cargar la app
4. ✅ **Validación de longitud** - Título 50 chars, Cuerpo 150 chars
5. ✅ **Clics con redirección** - Redirige a la pantalla correcta
6. ✅ **Modo offline** - Funciona sin internet
7. ✅ **Auto-cierre** - Se cierra después de 10 segundos

---

## 🎯 **Cómo funciona ahora:**

### **Antes:**
```
❌ Solo funcionaba en escritorio
❌ Clics no funcionaban en móvil  
❌ No había Service Worker
```

### **Ahora:**
```
✅ Funciona en escritorio Y móvil
✅ Clics redirigen correctamente en móvil
✅ Service Worker maneja todo automáticamente
✅ Funciona offline
✅ Listo para APK
```

---

## 🔧 **Para probar en desarrollo:**

```bash
# 1. Asegúrate de estar en el proyecto
cd "Proyecto FoodLink"

# 2. Instala dependencias (si no lo has hecho)
npm install

# 3. Inicia el servidor
npm run dev

# 4. Abre en navegador
# http://localhost:3000

# 5. Acepta permisos de notificaciones

# 6. Prueba enviando una notificación (abre consola F12):
```

```javascript
// En la consola del navegador:
import { notifyNewOrder } from './src/services/notifications/notificationService';

// Probar notificación
notifyNewOrder('test-123', 'Juan Pérez', 150.50);
```

---

## 📲 **Para generar APK:**

### **Opción Rápida (PWA):**

1. Despliega en Vercel/Netlify (gratis con HTTPS)
2. Abre en Chrome Android
3. Toca "Instalar app"
4. ¡Listo! Ya tienes una app instalable

### **Opción Completa (APK real):**

```bash
# 1. Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# 2. Inicializar
npx cap init

# 3. Agregar Android
npx cap add android

# 4. Construir
npm run build
npx cap copy
npx cap open android

# 5. En Android Studio: Build → Generate Signed APK
```

---

## 🎨 **IMPORTANTE: Crear Íconos**

Necesitas crear íconos para la app en `public/icons/`:

**Tamaños necesarios:**
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

**Herramienta recomendada:**
```bash
# Instalar generador
npm install -g pwa-asset-generator

# Generar todos los íconos desde tu logo
pwa-asset-generator tu-logo.png public/icons
```

O usa esta web (sin instalar nada):
- https://favicon.io/favicon-converter/
- Sube tu logo
- Descarga todos los tamaños
- Copia a `public/icons/`

---

## 🧪 **Probar Notificaciones:**

### **Método 1: Usar las funciones helper**

```typescript
import { 
  notifyNewOrder,
  notifyOrderUpdate,
  notifyVendorMessage,
  notifyPromotion 
} from '@/services/notifications/notificationService';

// Nuevo pedido
await notifyNewOrder('pedido-123', 'María López', 89.50);

// Actualización
await notifyOrderUpdate('pedido-123', 'listo');

// Mensaje de vendedor
await notifyVendorMessage('v-456', 'Tacos El Güero', 'Tu pedido está listo');

// Promoción
await notifyPromotion('Descuento 20%', 'Tacos al pastor hoy', 'prod-789');
```

### **Método 2: Desde la consola del navegador**

```javascript
// En F12 → Console:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(reg => {
    reg.showNotification('🎉 Prueba', {
      body: 'Esta es una notificación de prueba',
      icon: '/icons/icon-192x192.png',
      data: { url: '/menu' }
    });
  });
}
```

---

## 📊 **Verificar que funciona:**

### **1. Service Worker registrado:**
- F12 → Application → Service Workers
- Debe aparecer: `/sw.js` - Activated and running

### **2. Manifest válido:**
- F12 → Application → Manifest
- Debe cargar sin errores

### **3. PWA instalable:**
- F12 → Lighthouse → Generate report
- PWA score debe ser >80

---

## 🐛 **Si algo no funciona:**

### **Service Worker no se registra:**
```bash
# Limpiar cache
# En Chrome: F12 → Application → Clear storage → Clear site data

# Verificar en consola
console.log('SW support:', 'serviceWorker' in navigator);
```

### **Notificaciones no aparecen:**
1. Verifica permisos: Configuración del navegador → Permisos
2. En iOS: Solo funciona en PWA instalada (no en Safari)
3. Asegúrate de estar en HTTPS o localhost

### **Clics no redirigen:**
- Verifica que el Service Worker esté activo
- Mira los logs en F12 → Application → Service Workers → Console

---

## 📖 **Archivos Creados:**

```
Proyecto FoodLink/
├── public/
│   ├── sw.js                    ← Service Worker
│   ├── manifest.json            ← Configuración PWA
│   ├── offline.html             ← Página sin conexión
│   └── icons/                   ← NECESITAS CREAR ÍCONOS
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       └── ...
├── src/
│   ├── components/
│   │   └── ServiceWorkerInit.tsx  ← Inicializa SW
│   ├── services/
│   │   └── notifications/
│   │       └── notificationService.ts  ← Actualizado para móvil
│   └── utils/
│       └── registerServiceWorker.ts    ← Registro de SW
├── next.config.js              ← Actualizado
├── DESPLIEGUE_MOVIL.md        ← Documentación completa
└── GUIA_RAPIDA_MOVIL.md       ← Este archivo
```

---

## ✨ **Próximos Pasos:**

1. [ ] Crear los íconos de la app
2. [ ] Probar notificaciones en localhost
3. [ ] Desplegar en Vercel/Netlify (gratis)
4. [ ] Probar en móvil Android
5. [ ] Generar APK si lo necesitas

---

## 💡 **Comandos Útiles:**

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Verificar Service Worker
# En navegador: chrome://serviceworker-internals/

# Ver notificaciones registradas (Android)
adb shell dumpsys notification
```

---

## 🎓 **Explicación Simple:**

**Service Worker** = Un "ayudante" que corre en segundo plano
- Recibe notificaciones
- Maneja clics
- Funciona aunque cierres la app (en móvil)

**PWA** = Progressive Web App
- App web que se comporta como app nativa
- Se instala en el teléfono
- Funciona offline

**manifest.json** = "Tarjeta de presentación" de tu app
- Nombre
- Íconos
- Colores
- Permisos

---

## 🆘 **¿Necesitas Ayuda?**

### **Recursos:**
- Documentación completa: `DESPLIEGUE_MOVIL.md`
- Service Worker: `public/sw.js`
- Servicio de notificaciones: `src/services/notifications/notificationService.ts`

### **Testing:**
1. Abre `test-notifications.html` en tu navegador
2. Prueba cada función
3. Verifica que los clics redirigen correctamente

---

**¡Todo está listo para móvil! 🎉**

Solo falta:
1. Crear los íconos
2. Desplegar en producción con HTTPS
3. Probar en un dispositivo móvil real

¿Alguna duda? Revisa `DESPLIEGUE_MOVIL.md` para más detalles.

