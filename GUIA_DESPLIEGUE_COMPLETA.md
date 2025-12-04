# 📱 Guía Completa de Despliegue - FoodLink

**Fecha**: Diciembre 2025  
**Proyecto**: FoodLink v4.0.0  
**Objetivo**: Documentar los 2 métodos principales para convertir tu app web en app móvil

---

## 📊 **Comparación Rápida de Métodos**

| Característica | PWA en Vercel ⭐ | APK con Capacitor |
|----------------|------------------|-------------------|
| **Dificultad** | ⭐ Muy Fácil | ⭐⭐⭐ Media |
| **Tiempo Setup** | 5 minutos | 30-60 minutos |
| **Costo** | ✅ GRATIS | ✅ GRATIS |
| **Requiere Android Studio** | ❌ No | ✅ Sí |
| **Actualizaciones** | Automáticas | Manual (nuevo APK) |
| **Funciona en iOS** | ✅ Sí (Safari) | ⚠️ Requiere Mac + Xcode |
| **Funciona en Android** | ✅ Sí (Chrome) | ✅ Sí |
| **Subir a Google Play** | ❌ No | ✅ Sí |
| **Funciona offline** | ✅ Sí | ✅ Sí |
| **Notificaciones Push** | ✅ Sí | ✅ Sí |
| **Tamaño** | ~5 MB | ~20-50 MB |
| **Internet requerido** | Solo primera vez | Solo primera vez |
| **Acceso a funciones nativas** | ⚠️ Limitado | ✅ Total |

---

# 🌐 MÉTODO 1: PWA en Vercel (RECOMENDADO)

## ⭐ **¿Por qué este método?**

- ✅ **Más rápido**: Listo en 5 minutos
- ✅ **Más fácil**: Solo 3 comandos
- ✅ **Gratis**: Sin costo alguno
- ✅ **Actualizaciones**: Automáticas sin reinstalar
- ✅ **Multiplataforma**: Funciona en Android e iOS
- ✅ **Sin requisitos**: No necesitas Android Studio
- ✅ **URL pública**: Cualquiera puede acceder desde cualquier lugar

---

## 📋 **Requisitos Previos**

- ✅ Node.js instalado (ya lo tienes)
- ✅ Proyecto FoodLink (ya lo tienes)
- ✅ Cuenta de GitHub, GitLab o email
- ✅ Credenciales de Firebase configuradas en `.env`

---

## 🚀 **Paso a Paso - Despliegue en Vercel**

### **Paso 1: Verificar configuración del proyecto**

Asegúrate que tu archivo `.env` exista con tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_ENV=production
```

---

### **Paso 2: Instalar Vercel CLI**

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
npm install -g vercel
```

**¿Qué hace esto?**  
Instala la herramienta de línea de comandos de Vercel globalmente en tu computadora.

---

### **Paso 3: Iniciar sesión en Vercel**

```bash
vercel login
```

**Opciones de login:**
- Email
- GitHub (recomendado)
- GitLab
- Bitbucket

**Proceso:**
1. Te abrirá el navegador
2. Selecciona tu método de login preferido
3. Autoriza la aplicación
4. Vuelve a la terminal

---

### **Paso 4: Desplegar el proyecto**

En la terminal, ejecuta:

```bash
vercel --prod
```

**Proceso interactivo:**

```bash
? Set up and deploy "~/Proyecto FoodLink"? [Y/n] 
# Presiona Enter (Y)

? Which scope do you want to deploy to?
# Selecciona tu cuenta

? Link to existing project? [y/N]
# Presiona N (nuevo proyecto)

? What's your project's name? foodlink
# Escribe: foodlink

? In which directory is your code located? ./
# Presiona Enter (directorio actual)

? Want to override the settings? [y/N]
# Presiona N (usar configuración automática)
```

**Tiempo de espera**: 2-5 minutos para el primer despliegue.

---

### **Paso 5: Obtener tu URL**

Al terminar, Vercel te mostrará algo como:

```bash
✅ Production: https://foodlink-abc123.vercel.app [deployed]
📝 Inspect: https://vercel.com/tu-usuario/foodlink
```

**¡Esa es tu URL pública!** 🎉

Cópiala, es la que compartirás con los usuarios.

---

### **Paso 6: Configurar variables de entorno en Vercel**

**Importante**: Las variables de `.env` NO se suben por seguridad.

**Configurarlas en Vercel:**

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto "foodlink"
3. Click en **Settings**
4. Click en **Environment Variables**
5. Agrega cada variable:

```
NEXT_PUBLIC_FIREBASE_API_KEY = tu_valor_aquí
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = tu_valor_aquí
NEXT_PUBLIC_FIREBASE_PROJECT_ID = tu_valor_aquí
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = tu_valor_aquí
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = tu_valor_aquí
NEXT_PUBLIC_FIREBASE_APP_ID = tu_valor_aquí
NEXT_PUBLIC_ENV = production
```

6. Click en **Save**
7. Vuelve a desplegar:

```bash
vercel --prod
```

---

### **Paso 7: Probar la app en móvil**

#### **En Android (Chrome):**

1. Abre Chrome en tu celular
2. Ve a: `https://foodlink-abc123.vercel.app`
3. Chrome mostrará un banner: **"Instalar FoodLink"**
4. Click en **Instalar**
5. ✅ Se instala como app nativa en tu celular

**O manualmente:**
1. Menú (⋮) → **"Agregar a pantalla de inicio"**
2. Confirmar

#### **En iOS (Safari):**

1. Abre Safari en tu iPhone
2. Ve a: `https://foodlink-abc123.vercel.app`
3. Click en el botón de compartir (□↑)
4. Selecciona **"Agregar a pantalla de inicio"**
5. Confirmar
6. ✅ Se agrega como app

---

### **Paso 8: Verificar que todo funcione**

✅ **Checklist:**
- [ ] La app carga correctamente
- [ ] Puedes registrarte/iniciar sesión
- [ ] Firebase funciona (datos se guardan)
- [ ] Puedes ver el menú
- [ ] Puedes agregar al carrito
- [ ] Puedes hacer pedidos
- [ ] Notificaciones funcionan
- [ ] Funciona offline (cierra WiFi y prueba)

---

## 🔄 **Actualizar la app (cambios futuros)**

Cuando hagas cambios en tu código:

```bash
# 1. Guarda tus cambios
git add .
git commit -m "Descripción del cambio"

# 2. Despliega nuevamente
vercel --prod
```

**¡Y listo!** Los usuarios verán los cambios automáticamente (sin reinstalar).

---

## 💰 **Costos de Vercel**

**Plan Hobby (GRATIS):**
- ✅ Bandwidth: 100 GB/mes
- ✅ Builds: Ilimitados
- ✅ Dominios personalizados
- ✅ HTTPS automático
- ✅ Más que suficiente para tu proyecto

**¿Cuándo pagar?**  
Solo si superas 100 GB/mes de tráfico (necesitarías ~10,000 usuarios activos).

---

## 🌍 **Usar dominio personalizado (Opcional)**

Si quieres `foodlink.com` en lugar de `foodlink.vercel.app`:

1. Compra un dominio (GoDaddy, Namecheap, etc.)
2. En Vercel Dashboard → Settings → Domains
3. Agrega tu dominio
4. Configura los DNS según instrucciones
5. ✅ Listo: `https://foodlink.com`

**Costo**: ~$10-15 USD/año

---

## ⚡ **Ventajas de este método**

### ✅ **Para ti (Desarrollador):**
- Deploy en minutos
- Sin configuraciones complejas
- Actualizaciones instantáneas
- Analytics gratis
- Logs de errores
- CI/CD automático

### ✅ **Para usuarios:**
- URL fácil de compartir
- Instalable con 1 click
- Actualizaciones automáticas
- Funciona offline
- Rápida (CDN global)
- Ligera (~5 MB)

### ✅ **Para el proyecto:**
- Escalable automáticamente
- HTTPS incluido
- Certificados SSL gratis
- Backups automáticos
- Rollback fácil

---

## 🐛 **Solución de problemas comunes**

### **Error: "Missing environment variables"**

**Solución:**
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Agrega todas las variables `NEXT_PUBLIC_*`
3. Redeploy: `vercel --prod`

### **Error: "Failed to compile"**

**Solución:**
```bash
# Limpia y reconstruye localmente
rm -rf .next node_modules
npm install
npm run build

# Si funciona local, despliega
vercel --prod
```

### **Firebase no funciona en producción**

**Solución:**
1. Verifica que las variables de entorno estén en Vercel
2. En Firebase Console → Authentication → Settings
3. Agrega tu dominio de Vercel a "Authorized domains"

---

# 📦 MÉTODO 2: APK con Capacitor

## ⚠️ **¿Cuándo usar este método?**

Usa APK con Capacitor si:
- ✅ Quieres subirlo a Google Play Store
- ✅ Necesitas acceso a funciones nativas avanzadas
- ✅ Quieres distribución offline (sin URL)
- ✅ Tienes experiencia con Android Studio

**No uses este método si:**
- ❌ Solo quieres que usuarios prueben la app
- ❌ No tienes experiencia con desarrollo Android
- ❌ Quieres actualizaciones rápidas

---

## 📋 **Requisitos Previos**

- ✅ Node.js instalado
- ✅ Java JDK 17 instalado
- ✅ Android Studio instalado
- ✅ ~5 GB de espacio en disco
- ✅ Tiempo: 30-60 minutos (primera vez)

---

## 🛠️ **Instalación de Requisitos**

### **1. Instalar Java JDK 17**

**Windows:**
1. Descargar: https://adoptium.net/
2. Instalar JDK 17
3. Configurar JAVA_HOME:
   - Abrir "Variables de entorno"
   - Nueva variable de sistema:
     - Nombre: `JAVA_HOME`
     - Valor: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x`
   - Agregar a PATH: `%JAVA_HOME%\bin`

**Verificar:**
```bash
java -version
# Debe mostrar: openjdk version "17.x.x"
```

### **2. Instalar Android Studio**

1. Descargar: https://developer.android.com/studio
2. Instalar con configuración estándar
3. Durante instalación, incluir:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device

**Configurar variables de entorno:**
```bash
ANDROID_HOME = C:\Users\TU_USUARIO\AppData\Local\Android\Sdk
```

Agregar a PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

**Verificar:**
```bash
adb version
# Debe mostrar: Android Debug Bridge version
```

---

## 🚀 **Paso a Paso - Crear APK**

### **Paso 1: Instalar Capacitor**

En tu proyecto, ejecuta:

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

---

### **Paso 2: Configurar Next.js para exportación estática**

Edita `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // ← AGREGAR ESTA LÍNEA
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,  // ← AGREGAR ESTA LÍNEA
  },
  // Desactivar trailing slash para Capacitor
  trailingSlash: true,  // ← AGREGAR ESTA LÍNEA
  
  // ... resto de tu configuración existente
};

module.exports = nextConfig;
```

---

### **Paso 3: Crear carpeta de salida**

```bash
npm run build
```

Esto creará la carpeta `out/` con tu app compilada.

---

### **Paso 4: Inicializar Capacitor**

```bash
npx cap init
```

**Preguntas:**

```
? App name (the visible name): FoodLink
? App ID (domain identifier): com.foodlink.app
? Directory of your built web assets: out
```

---

### **Paso 5: Agregar plataforma Android**

```bash
npx cap add android
```

Esto creará la carpeta `android/` con el proyecto Android.

---

### **Paso 6: Copiar archivos web a Android**

```bash
npx cap sync
```

Este comando:
1. Copia los archivos de `out/` a Android
2. Actualiza configuraciones
3. Instala plugins nativos

---

### **Paso 7: Configurar archivo capacitor.config.ts**

Crea/edita `capacitor.config.ts` en la raíz:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foodlink.app',
  appName: 'FoodLink',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Permite que Firebase funcione
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#719a0a",
      showSpinner: false,
    },
  },
};

export default config;
```

---

### **Paso 8: Configurar Firebase para APK**

Edita `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
  <!-- Agregar estos permisos -->
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  
  <application
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config">
    <!-- ... resto del contenido ... -->
  </application>
</manifest>
```

Crea `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">firebaseio.com</domain>
        <domain includeSubdomains="true">googleapis.com</domain>
    </domain-config>
</network-security-config>
```

---

### **Paso 9: Abrir en Android Studio**

```bash
npx cap open android
```

Esto abrirá Android Studio con tu proyecto.

**Primera vez:**
- Android Studio descargará dependencias (~10 minutos)
- Sincronizará Gradle
- Indexará archivos

---

### **Paso 10: Configurar firma del APK**

En Android Studio:

1. **Build** → **Generate Signed Bundle / APK**
2. Selecciona **APK**
3. Click **Next**
4. Click **Create new...** (para keystore)

**Configuración del Keystore:**
```
Key store path: C:\Users\TU_USUARIO\foodlink-key.jks
Password: [tu_contraseña_segura]
Alias: foodlink
Validity (years): 25

First and Last Name: Tu Nombre
Organizational Unit: Development
Organization: FoodLink
City: Tu Ciudad
State: Tu Estado
Country: MX
```

5. Click **OK**
6. Selecciona **release**
7. Marca las dos casillas (V1 y V2)
8. Click **Finish**

**⚠️ IMPORTANTE:** Guarda el archivo `.jks` y las contraseñas. Los necesitarás para actualizar la app.

---

### **Paso 11: Compilar APK**

**Opción 1 - Desde Android Studio:**
1. Build → Generate Signed Bundle / APK
2. Usar el keystore que creaste
3. Esperar compilación (~5 minutos)

**Opción 2 - Desde terminal:**
```bash
cd android
./gradlew assembleRelease
```

---

### **Paso 12: Ubicar el APK**

El APK estará en:
```
android/app/build/outputs/apk/release/app-release.apk
```

**Tamaño aproximado:** 20-50 MB

---

### **Paso 13: Instalar en dispositivo**

**Método 1 - USB:**
1. Conecta tu celular por USB
2. Habilita "Depuración USB" en ajustes de desarrollador
3. En Android Studio: Run → Run 'app'

**Método 2 - APK File:**
1. Copia `app-release.apk` a tu celular
2. Abre el archivo
3. Permite "Instalar desde fuentes desconocidas"
4. Instalar

**Método 3 - ADB:**
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

### **Paso 14: Probar la app**

✅ **Checklist:**
- [ ] App abre sin crashes
- [ ] Firebase conecta correctamente
- [ ] Login/Registro funciona
- [ ] Menú carga platillos
- [ ] Carrito funciona
- [ ] Pedidos se crean
- [ ] Notificaciones funcionan
- [ ] Funciona offline

---

## 🔄 **Actualizar la app (nuevas versiones)**

Cuando hagas cambios:

```bash
# 1. Reconstruir Next.js
npm run build

# 2. Sincronizar con Capacitor
npx cap sync

# 3. Abrir Android Studio
npx cap open android

# 4. Incrementar versión en android/app/build.gradle:
versionCode 2  # Era 1, ahora 2
versionName "1.1"  # Era "1.0", ahora "1.1"

# 5. Generar nuevo APK firmado
Build → Generate Signed Bundle / APK
```

**Usuarios deberán:**
- Desinstalar versión anterior
- Instalar nuevo APK

---

## 📤 **Subir a Google Play Store (Opcional)**

### **Requisitos:**
- Cuenta de Google Play Developer ($25 USD único pago)
- APK o AAB firmado
- Íconos y screenshots
- Descripción de la app

### **Proceso:**

1. **Crear cuenta:**
   - Ve a: https://play.google.com/console
   - Paga los $25 USD

2. **Crear app:**
   - Click en "Crear app"
   - Nombre: FoodLink
   - Categoría: Comida y bebida
   - Completa información requerida

3. **Preparar assets:**
   - Ícono: 512x512px
   - Feature graphic: 1024x500px
   - Screenshots: al menos 2 (phone)

4. **Subir APK/AAB:**
   - Producción → Crear nueva versión
   - Sube tu APK
   - Completa notas de versión

5. **Revisar y publicar:**
   - Google revisa (~1-7 días)
   - Una vez aprobado, estará en Play Store

---

## 💰 **Costos del Método APK**

| Concepto | Costo |
|----------|-------|
| Desarrollo | ✅ GRATIS |
| Android Studio | ✅ GRATIS |
| Generar APK | ✅ GRATIS |
| Distribución privada | ✅ GRATIS |
| Cuenta Google Play | $25 USD (único pago) |
| Renovación anual | ✅ NO (pago único) |

---

## ⚡ **Ventajas y Desventajas**

### ✅ **Ventajas:**
- App 100% nativa
- Acceso completo a funciones del dispositivo
- Puede estar en Google Play Store
- Funciona completamente offline
- No depende de servidor web
- Mejor rendimiento en funciones nativas

### ❌ **Desventajas:**
- Configuración más compleja
- Requiere Android Studio (~5 GB)
- Actualizaciones requieren nuevo APK
- Usuarios deben reinstalar para actualizar
- Solo Android (iOS requiere Mac + Xcode)
- Tiempo de setup: 30-60 minutos

---

## 🐛 **Solución de Problemas**

### **Error: "JAVA_HOME not set"**
```bash
# Windows
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.x"
```

### **Error: "SDK location not found"**

Crea `android/local.properties`:
```properties
sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### **Error: "Failed to compile"**
```bash
cd android
./gradlew clean
./gradlew build
```

### **App crashea al abrir**

Revisa logs:
```bash
adb logcat | grep "FoodLink"
```

### **Firebase no conecta**

1. Verifica `AndroidManifest.xml` tenga permisos de internet
2. Verifica `network_security_config.xml`
3. Revisa que Firebase esté configurado para Android

---

# 🎯 **¿Cuál método elegir?**

## **Elige PWA (Método 1) si:**
- ✅ Es tu primer despliegue
- ✅ Quieres algo rápido y fácil
- ✅ Necesitas actualizaciones frecuentes
- ✅ Quieres que funcione en iOS también
- ✅ No tienes experiencia con Android
- ✅ Prefieres URL compartible

## **Elige APK (Método 2) si:**
- ✅ Quieres subirlo a Google Play
- ✅ Necesitas funciones nativas avanzadas
- ✅ Tienes experiencia con Android Studio
- ✅ Prefieres app 100% nativa
- ✅ No te importa el tiempo de setup
- ✅ Distribución será limitada

---

# 📊 **Tabla Comparativa Final**

| Aspecto | PWA (Vercel) | APK (Capacitor) |
|---------|--------------|-----------------|
| **Tiempo inicial** | 5 min | 60 min |
| **Dificultad** | Muy fácil | Media |
| **Actualizaciones** | Automáticas | Manual |
| **Requiere reinstalar** | No | Sí |
| **Funciona en iOS** | Sí | No (sin Mac) |
| **Funciona en Android** | Sí | Sí |
| **Google Play** | No | Sí |
| **URL compartible** | Sí | No |
| **Tamaño app** | ~5 MB | ~30 MB |
| **Offline** | Sí | Sí |
| **Notificaciones** | Sí | Sí |
| **Costo** | GRATIS | GRATIS ($25 para Play Store) |
| **Mejor para** | Mayoría de casos | Apps en tiendas |

---

# 🎓 **Recomendación Final**

## **Para FoodLink, recomiendo:**

### **Fase 1 - PWA en Vercel (Ahora)** ⭐
Razones:
- Deploy en 5 minutos
- Usuarios pueden probar inmediatamente
- Actualizaciones instantáneas
- Funciona en Android e iOS
- Cero costo
- Perfecto para validar el producto

### **Fase 2 - APK para Play Store (Después)**
Cuando:
- Tengas usuarios activos y feedback
- Quieras presencia en Play Store
- Necesites funciones nativas específicas
- Tengas tiempo para mantener ambas versiones

---

# 📞 **Soporte y Recursos**

## **Documentación Oficial:**
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Capacitor: https://capacitorjs.com/docs
- Firebase: https://firebase.google.com/docs

## **Comunidad:**
- Next.js Discord: https://nextjs.org/discord
- Stack Overflow: Tag `next.js` y `capacitor`

---

# ✅ **Checklist Final**

## **Para PWA:**
- [ ] `.env` configurado
- [ ] Vercel CLI instalado
- [ ] Deploy ejecutado
- [ ] Variables en Vercel configuradas
- [ ] App probada en móvil
- [ ] PWA instalada exitosamente

## **Para APK:**
- [ ] Java JDK 17 instalado
- [ ] Android Studio instalado
- [ ] Capacitor instalado
- [ ] next.config.js configurado
- [ ] Android agregado
- [ ] Keystore creado
- [ ] APK generado
- [ ] App instalada en dispositivo
- [ ] Todo funciona correctamente

---

**¡Listo!** Con esta guía tienes todo lo necesario para desplegar tu app de cualquiera de las dos formas. 🚀

**Siguiente paso recomendado:** Empieza con PWA en Vercel (5 minutos) y luego decides si quieres hacer el APK.

