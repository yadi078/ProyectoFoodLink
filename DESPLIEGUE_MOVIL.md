# 📱 Guía de Despliegue Móvil - FoodLink

## ✅ Sistema de Notificaciones Implementado

Tu app ahora tiene un sistema completo de notificaciones que funciona en dispositivos móviles con Service Worker.

---

## 🎯 **¿Qué se implementó?**

### 1. ✅ **Service Worker** (`public/sw.js`)

- Maneja notificaciones push en móviles
- Gestiona clics y redirecciones correctamente
- Cache offline para funcionar sin internet
- Sincronización en background

### 2. ✅ **manifest.json** (`public/manifest.json`)

- Configuración PWA completa
- Íconos para todas las plataformas
- Metadatos de la app

### 3. ✅ **Registro de Service Worker** (`src/utils/registerServiceWorker.ts`)

- Registro automático al cargar la app
- Detección de actualizaciones
- Manejo de errores

### 4. ✅ **Componente de Inicialización** (`src/components/ServiceWorkerInit.tsx`)

- Indicador de estado offline
- Notificaciones de actualización
- Mensajes de compatibilidad

### 5. ✅ **Servicio de Notificaciones Actualizado**

- Usa Service Worker automáticamente en móvil
- Fallback a API básica en escritorio
- Validación de longitud
- Manejo de clics con redirección

---

## 📋 **Pasos para Desplegar en Móvil**

### **Opción 1: PWA (Recomendado para Web)**

#### 1. **Crear los Íconos**

Necesitas crear íconos en diferentes tamaños. Puedes usar herramientas como [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator):

```bash
# Instalar generador de assets PWA
npm install -g pwa-asset-generator

# Generar todos los íconos desde un logo
pwa-asset-generator logo.png public/icons
```

O crear manualmente en `public/icons/`:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

#### 2. **Desplegar con HTTPS**

El Service Worker **requiere HTTPS** (excepto en localhost).

**Opciones de hosting:**

- **Vercel** (recomendado para Next.js) - HTTPS automático
- **Netlify** - HTTPS automático
- **Firebase Hosting** - HTTPS automático
- **AWS Amplify** - HTTPS automático

**Ejemplo con Vercel:**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod
```

#### 3. **Instalar como PWA**

**En Android:**

1. Abre la app en Chrome
2. Toca el menú (⋮)
3. Selecciona "Instalar app" o "Agregar a pantalla de inicio"
4. Confirma la instalación

**En iOS (16.4+):**

1. Abre la app en Safari
2. Toca el botón de compartir (□↑)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma

---

### **Opción 2: APK con Capacitor (Recomendado para Tiendas)**

Si quieres crear un APK para subirlo a Google Play:

#### 1. **Instalar Capacitor**

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

#### 2. **Inicializar Capacitor**

```bash
npx cap init
```

Te preguntará:

- **App name:** FoodLink
- **App ID:** com.foodlink.app
- **Web dir:** out (para Next.js con exportación estática)

#### 3. **Configurar Next.js para Exportación Estática**

Actualiza `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // ... resto de tu configuración
};

module.exports = nextConfig;
```

#### 4. **Construir y Exportar**

```bash
# Construir la app
npm run build

# Copiar a Capacitor
npx cap copy
```

#### 5. **Agregar Plataforma Android**

```bash
npx cap add android
```

#### 6. **Configurar Push Notifications en Capacitor**

Instala el plugin de notificaciones:

```bash
npm install @capacitor/push-notifications
```

Actualiza `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.foodlink.app",
  appName: "FoodLink",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
```

#### 7. **Abrir en Android Studio**

```bash
npx cap open android
```

Esto abrirá Android Studio donde puedes:

- Compilar el APK
- Firmar la app
- Generar el APK release

#### 8. **Generar APK**

En Android Studio:

1. `Build` → `Generate Signed Bundle / APK`
2. Selecciona `APK`
3. Crea o usa un keystore
4. Selecciona `release`
5. Build

El APK estará en: `android/app/release/app-release.apk`

---

### **Opción 3: APK con Expo (Si usas React Native)**

Si necesitas funcionalidades nativas adicionales:

```bash
# Crear proyecto Expo
npx create-expo-app FoodLink

# Instalar dependencias
npm install expo-notifications expo-device expo-constants

# Construir APK
eas build --platform android --profile preview
```

---

## 🧪 **Probar las Notificaciones**

### **En Escritorio**

1. Abre la app en Chrome
2. Acepta los permisos de notificaciones
3. Abre la consola del navegador
4. Ejecuta:
   ```javascript
   // Probar notificación
   if ("serviceWorker" in navigator) {
     navigator.serviceWorker.ready.then((registration) => {
       registration.showNotification("Prueba", {
         body: "Notificación de prueba",
         icon: "/icons/icon-192x192.png",
         data: { url: "/menu" },
       });
     });
   }
   ```

### **En Móvil Android**

1. Despliega la app en Vercel/Netlify
2. Abre en Chrome móvil
3. Instala como PWA
4. Acepta permisos de notificaciones
5. Prueba enviando una notificación

### **En Móvil iOS**

1. Despliega la app en Vercel/Netlify
2. Abre en Safari
3. Instala en pantalla de inicio
4. Las notificaciones solo funcionarán en la PWA instalada (no en Safari)

---

## 📱 **Compatibilidad**

| Plataforma             | Notificaciones | Clics | Offline | Estado               |
| ---------------------- | -------------- | ----- | ------- | -------------------- |
| Chrome Desktop         | ✅             | ✅    | ✅      | Completo             |
| Firefox Desktop        | ✅             | ✅    | ✅      | Completo             |
| Safari Desktop         | ✅             | ✅    | ⚠️      | Parcial              |
| Chrome Android         | ✅             | ✅    | ✅      | Completo             |
| Firefox Android        | ✅             | ✅    | ✅      | Completo             |
| Safari iOS (navegador) | ❌             | ❌    | ❌      | No soportado         |
| Safari iOS (PWA)       | ✅             | ✅    | ✅      | Completo (iOS 16.4+) |
| APK Android            | ✅             | ✅    | ✅      | Completo             |

---

## 🔧 **Configuración de Firebase (Opcional)**

Si quieres notificaciones push desde el servidor:

### 1. **Configurar Firebase Cloud Messaging**

En `firebase.json`:

```json
{
  "messaging": {
    "vapidKey": "TU_CLAVE_VAPID_AQUI"
  }
}
```

### 2. **Obtener clave VAPID**

1. Ve a Firebase Console
2. Project Settings → Cloud Messaging
3. Copia la clave VAPID

### 3. **Actualizar manifest.json**

```json
{
  "gcm_sender_id": "TU_SENDER_ID_AQUI"
}
```

---

## 🐛 **Solución de Problemas**

### **Service Worker no se registra**

```javascript
// Verificar en consola
console.log("Service Worker support:", "serviceWorker" in navigator);
console.log("Notifications support:", "Notification" in window);
```

**Solución:**

- Asegúrate de estar en HTTPS o localhost
- Limpia el cache del navegador
- Desregistra SWs antiguos en DevTools → Application → Service Workers

### **Notificaciones no aparecen en móvil**

**Solución:**

- Verifica permisos en configuración del navegador
- En iOS, solo funciona en PWA instalada
- Asegúrate de que el Service Worker esté activo

### **Clics no redirigen**

**Solución:**

- Verifica que el Service Worker maneje `notificationclick`
- Revisa los datos enviados con la notificación
- Mira los logs en DevTools → Application → Service Workers

### **APK no compila**

**Solución:**

- Verifica que Java JDK 17 esté instalado
- Actualiza Gradle en `android/gradle/wrapper/gradle-wrapper.properties`
- Sincroniza el proyecto en Android Studio

---

## 📊 **Verificar Estado**

### **Herramientas de Desarrollo**

1. **Chrome DevTools:**

   - F12 → Application → Service Workers
   - Ver estado, actualizar, desregistrar

2. **Lighthouse:**

   - F12 → Lighthouse → Run audit
   - Verifica PWA score

3. **Application Tab:**
   - Manifest
   - Service Workers
   - Cache Storage
   - Background Services

### **Testing PWA**

Usa [PWA Builder](https://www.pwabuilder.com/) para verificar tu PWA.

---

## 🚀 **Checklist de Despliegue**

- [ ] Íconos creados en `public/icons/`
- [ ] `manifest.json` configurado
- [ ] Service Worker funcionando (`/sw.js` accesible)
- [ ] Desplegado en HTTPS
- [ ] Notificaciones probadas en escritorio
- [ ] PWA instalable en Android
- [ ] PWA instalable en iOS (opcional)
- [ ] APK generado (si aplica)
- [ ] Verificado con Lighthouse (score >80)

---

## 📖 **Recursos Adicionales**

- [Web.dev - Progressive Web Apps](https://web.dev/progressive-web-apps/)
- [MDN - Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Next.js PWA](https://github.com/shadowwalker/next-pwa)

---

## 💡 **Próximos Pasos**

1. **Crear los íconos** para tu app
2. **Desplegar en Vercel** con HTTPS
3. **Probar en móvil** instalando como PWA
4. **Generar APK** si quieres subirlo a Google Play

¿Necesitas ayuda con algún paso específico? 🚀
