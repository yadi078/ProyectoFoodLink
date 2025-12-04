# 📱 Guía APK para Proyecto Escolar - FoodLink

**🎓 Método Recomendado para Entregas Académicas**  
**⏱️ Tiempo Total: 10-15 minutos**  
**💰 Costo: GRATIS**  
**✅ Resultado: APK funcional + URL pública**

---

## 🎯 **¿Por qué este método?**

Este método es **perfecto para proyectos escolares** porque:

- ✅ **Más rápido**: 10-15 minutos vs 1-2 horas
- ✅ **Más fácil**: No requiere Android Studio ni Java
- ✅ **APK real**: Funcional e instalable
- ✅ **Sin errores**: Proceso automatizado
- ✅ **Profesional**: Usas herramientas de la industria
- ✅ **Doble entrega**: APK + URL funcionando

---

## 📋 **Requisitos Previos**

- ✅ Proyecto FoodLink funcionando localmente
- ✅ Node.js instalado
- ✅ Conexión a internet
- ✅ Archivo `.env` configurado con Firebase
- ✅ 15 minutos de tiempo

**¡Eso es todo!** No necesitas:
- ❌ Android Studio (5 GB)
- ❌ Java JDK
- ❌ Configuraciones complejas
- ❌ Conocimientos de Android

---

# 🚀 **PARTE 1: Desplegar en Vercel (5 minutos)**

## **Paso 1: Instalar Vercel CLI**

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
npm install -g vercel
```

**¿Qué hace?**  
Instala la herramienta de línea de comandos de Vercel globalmente.

**Tiempo de espera:** ~30 segundos

---

## **Paso 2: Iniciar sesión en Vercel**

```bash
vercel login
```

**Proceso:**
1. Se abrirá tu navegador automáticamente
2. Verás opciones de login:
   - GitHub (recomendado)
   - GitLab
   - Bitbucket
   - Email

3. **Selecciona GitHub** (más rápido):
   - Click en "Continue with GitHub"
   - Autoriza la aplicación
   - Vuelve a la terminal

**Alternativa con Email:**
1. Selecciona "Continue with Email"
2. Ingresa tu email
3. Vercel te enviará un link
4. Abre el email y click en el link
5. Vuelve a la terminal

**Confirmación:**  
Verás en la terminal: `> Success! Email authentication complete`

---

## **Paso 3: Configurar variables de entorno**

**⚠️ IMPORTANTE:** Antes de desplegar, asegúrate que tu archivo `.env` tenga todas las credenciales de Firebase.

**Verifica tu `.env`:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
NEXT_PUBLIC_ENV=production
```

**¿No tienes el archivo `.env`?**
1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona tu proyecto
3. Click en ⚙️ (configuración) → Project settings
4. Scroll down → "Your apps" → Web app
5. Copia las credenciales
6. Crea `.env` en la raíz del proyecto
7. Pega las credenciales con el formato de arriba

---

## **Paso 4: Desplegar el proyecto**

En la terminal, ejecuta:

```bash
vercel --prod
```

**Proceso interactivo (responde así):**

```bash
? Set up and deploy "~/Proyecto FoodLink"? [Y/n]
→ Presiona ENTER (dice Yes por defecto)

? Which scope do you want to deploy to?
→ Selecciona tu usuario (el que creaste)

? Link to existing project? [y/N]
→ Escribe: N  (es nuevo proyecto)
→ Presiona ENTER

? What's your project's name?
→ Escribe: foodlink
→ Presiona ENTER

? In which directory is your code located?
→ Presiona ENTER (deja ./  por defecto)

? Want to override the settings? [y/N]
→ Presiona ENTER (deja N por defecto)
```

**Ahora Vercel construirá tu proyecto:**

```
🔍 Inspect: https://vercel.com/tu-usuario/foodlink
✅ Production: https://foodlink-xyz123.vercel.app [deployed]
```

**⏱️ Tiempo de espera:** 2-4 minutos (primera vez)

**📋 COPIA Y GUARDA LA URL** que te da (ej: `https://foodlink-xyz123.vercel.app`)

---

## **Paso 5: Configurar variables de entorno en Vercel**

**⚠️ CRÍTICO:** Las variables de `.env` NO se suben por seguridad.

**Debes configurarlas en Vercel:**

### **Opción A - Desde el navegador (Recomendado):**

1. Ve a: https://vercel.com/dashboard

2. Busca tu proyecto "foodlink" y haz click

3. Click en la pestaña **"Settings"** (arriba)

4. En el menú lateral, click en **"Environment Variables"**

5. Agrega cada variable **UNA POR UNA**:

**Primera variable:**
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSy... (tu valor real de .env)
Environment: Production (marca la casilla)
```
Click **"Save"**

**Segunda variable:**
```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: tu-proyecto.firebaseapp.com
Environment: Production
```
Click **"Save"**

**Continúa con todas:**
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_ENV` (valor: `production`)

6. **Redesplegar** (para que tome las variables):
   - Vuelve a la terminal
   - Ejecuta: `vercel --prod`
   - Espera 2 minutos

---

## **Paso 6: Verificar que funciona**

1. Abre la URL en tu navegador: `https://foodlink-xyz123.vercel.app`

2. **Verifica:**
   - ✅ La página carga correctamente
   - ✅ Puedes registrarte/iniciar sesión
   - ✅ Firebase funciona (datos se guardan)
   - ✅ Puedes navegar por el menú
   - ✅ El carrito funciona

**Si todo funciona:** ✅ **¡Listo! Ahora generemos el APK**

**Si algo falla:**
- Revisa que las variables de entorno estén correctas
- Revisa la consola del navegador (F12) para errores
- Verifica que Firebase esté configurado correctamente

---

# 📦 **PARTE 2: Generar APK con PWA Builder (5 minutos)**

## **Paso 1: Abrir PWA Builder**

1. Abre tu navegador
2. Ve a: **https://www.pwabuilder.com/**
3. Verás la página principal con un campo de texto grande

---

## **Paso 2: Ingresar tu URL**

1. En el campo de texto, pega tu URL de Vercel:
   ```
   https://foodlink-xyz123.vercel.app
   ```

2. Click en el botón **"Start"** (o "Analyze")

**⏱️ Espera:** ~30-60 segundos mientras analiza tu PWA

---

## **Paso 3: Revisar el reporte**

Verás un reporte con puntuaciones:

```
✅ Manifest: 100/100
✅ Service Worker: 100/100
✅ Security: 100/100
```

**Si ves puntuaciones bajas (< 80):**
- No te preocupes, el APK se generará igual
- Es solo una recomendación de mejoras

**Scroll hacia abajo** hasta ver el botón **"Package For Stores"**

---

## **Paso 4: Empaquetar para Android**

1. Click en **"Package For Stores"** (botón grande morado/azul)

2. Verás 3 opciones:
   - Windows
   - Android ← **Selecciona esta**
   - iOS

3. Click en **"Android"**

---

## **Paso 5: Configurar el paquete Android**

Verás un formulario. **Llénalo así:**

### **Pestaña "Options":**

```
Package ID: com.foodlink.app
App name: FoodLink
Launcher name: FoodLink
Theme color: #719a0a
Background color: #ffffff
Icon URL: (deja el que detectó automáticamente)
Maskable icon: ☑️ (marcado)
Start URL: / (deja por defecto)
Display: standalone
Orientation: portrait
Status bar color: #719a0a
Splash screen fade out: 300
Enable notifications: ☑️ (marcado)
```

### **Pestaña "Signing Key" (Opcional):**

**Para proyecto escolar:** Deja todo en blanco o usa "None"

**Para producción real:** 
- Crea un keystore
- Guarda las credenciales

---

## **Paso 6: Generar el APK**

1. Después de llenar el formulario, scroll down

2. Click en **"Generate"** (botón verde/azul grande)

**⏱️ Espera:** ~1-2 minutos mientras genera el APK

3. Verás un mensaje: **"Your package is ready!"**

---

## **Paso 7: Descargar el APK**

1. Click en **"Download"**

2. Se descargará un archivo `.zip` (ej: `foodlink-signed.zip`)

3. **Descomprime el archivo .zip**

4. Dentro encontrarás:
   ```
   foodlink-signed/
   ├── app-release-signed.apk ← Este es tu APK
   ├── assetlinks.json
   └── README.md
   ```

5. **Renombra** `app-release-signed.apk` a algo más simple:
   ```
   foodlink.apk
   ```

---

## **Paso 8: Verificar el APK**

**Detalles del APK:**
- 📦 Tamaño: ~10-20 MB
- 📱 Compatible: Android 5.0+ (API 21+)
- ✅ Instalable: Sí
- 🌐 Requiere internet: Sí (para Firebase)
- 📴 Modo offline: Funciona parcialmente

---

# 📱 **PARTE 3: Probar e Instalar el APK (5 minutos)**

## **Opción 1: Instalar en tu celular (USB)**

### **Paso 1: Habilitar opciones de desarrollador**

**En tu Android:**
1. Ve a **Ajustes** → **Acerca del teléfono**
2. Busca **"Número de compilación"**
3. Toca 7 veces seguidas
4. Verás: "Ahora eres desarrollador"

### **Paso 2: Habilitar depuración USB**

1. Ve a **Ajustes** → **Sistema** → **Opciones de desarrollador**
2. Activa **"Depuración por USB"**
3. Activa **"Instalar aplicaciones desconocidas"**

### **Paso 3: Transferir e instalar**

1. Conecta tu celular a la PC con cable USB
2. Selecciona **"Transferencia de archivos"**
3. Copia `foodlink.apk` a la carpeta **"Descargas"** del celular
4. En el celular, abre **"Archivos"** o **"Mis archivos"**
5. Ve a **"Descargas"**
6. Toca **"foodlink.apk"**
7. Si pregunta, permite **"Instalar desde esta fuente"**
8. Toca **"Instalar"**
9. ✅ **¡Instalado!**

---

## **Opción 2: Compartir por WhatsApp/Email**

### **Método rápido:**

1. Sube `foodlink.apk` a Google Drive o Dropbox
2. Comparte el link
3. Ábrelo desde tu celular
4. Descarga el APK
5. Instala siguiendo los pasos de arriba

**O directamente:**
1. Envía `foodlink.apk` por WhatsApp/Telegram a ti mismo
2. Descarga en el celular
3. Instala

---

## **Opción 3: Usando ADB (Avanzado)**

Si tienes ADB instalado:

```bash
# Verificar que el celular esté conectado
adb devices

# Instalar el APK
adb install foodlink.apk
```

---

# ✅ **PARTE 4: Verificación y Entrega**

## **Verificar que todo funciona**

**Abre la app en tu celular y verifica:**

### **✅ Checklist de funcionalidad:**

- [ ] La app abre sin crashes
- [ ] Splash screen aparece
- [ ] Página de inicio carga
- [ ] Puedes ir al menú
- [ ] Puedes registrarte como estudiante
- [ ] Puedes iniciar sesión
- [ ] Firebase guarda los datos
- [ ] Puedes ver platillos
- [ ] Puedes agregar al carrito
- [ ] El carrito muestra los items
- [ ] Puedes hacer un pedido
- [ ] El pedido se guarda en Firebase
- [ ] Las notificaciones funcionan
- [ ] El modo offline funciona (cierra WiFi)

**Si todo funciona:** ✅ **¡Tu proyecto está listo para entregar!**

---

## **Archivos para entregar al profesor**

### **1. El APK**
```
📦 foodlink.apk (10-20 MB)
```

### **2. La URL pública**
```
🌐 https://foodlink-xyz123.vercel.app
```

### **3. Documento README** (opcional pero recomendado)

Crea un archivo `INSTRUCCIONES_INSTALACION.md`:

```markdown
# 📱 FoodLink - Instrucciones de Instalación

## Información del Proyecto
- **Nombre:** FoodLink
- **Versión:** 1.0.0
- **Plataforma:** Android 5.0+
- **Tipo:** Progressive Web App (PWA)

## 🌐 Acceso Web
La aplicación está desplegada y accesible en:
https://foodlink-xyz123.vercel.app

Puede abrirse en cualquier navegador (Chrome, Firefox, Safari).

## 📱 Instalación del APK

### Método 1: Desde archivo APK
1. Transferir `foodlink.apk` al dispositivo Android
2. Habilitar "Instalar desde fuentes desconocidas"
3. Abrir el archivo APK
4. Tocar "Instalar"
5. Abrir la aplicación

### Método 2: Como PWA (desde navegador)
1. Abrir la URL en Chrome Android
2. Tocar el menú (⋮)
3. Seleccionar "Agregar a pantalla de inicio"
4. Confirmar instalación

## 🔑 Credenciales de Prueba

### Estudiante:
- Email: estudiante@test.com
- Contraseña: Test1234

### Vendedor:
- Email: vendedor@test.com
- Contraseña: Test1234

## 📋 Funcionalidades Implementadas
- ✅ Registro e inicio de sesión
- ✅ Sistema de menús
- ✅ Carrito de compras
- ✅ Gestión de pedidos
- ✅ Sistema de calificaciones
- ✅ Chat en tiempo real
- ✅ Notificaciones push
- ✅ Modo offline

## 🛠️ Tecnologías Utilizadas
- Frontend: Next.js 14 + React 18 + TypeScript
- Backend: Firebase (Firestore + Authentication)
- Despliegue: Vercel
- PWA: Service Worker + Manifest
- Estilos: Tailwind CSS

## 📞 Soporte
Para cualquier problema durante la instalación o uso:
- Email: tu_email@example.com
- WhatsApp: [tu número]
```

---

# 📊 **Comparación con otros métodos**

## **¿Por qué PWA Builder es mejor para tu proyecto escolar?**

| Aspecto | PWA Builder ⭐ | Android Studio | Solo PWA |
|---------|----------------|----------------|----------|
| **Tiempo total** | 10-15 min | 60-120 min | 5 min |
| **Instalaciones necesarias** | Solo Vercel CLI | Java + AS (5GB) | Solo Vercel CLI |
| **Complejidad** | ⭐ Muy fácil | ⭐⭐⭐⭐⭐ Muy difícil | ⭐ Fácil |
| **Entrega APK** | ✅ Sí | ✅ Sí | ❌ No |
| **Entrega URL** | ✅ Sí | ❌ No | ✅ Sí |
| **Posibilidad de errores** | ⚠️ Baja | 🔴 Alta | ✅ Muy baja |
| **Requiere conocimientos Android** | ❌ No | ✅ Sí | ❌ No |
| **Resultado profesional** | ✅ Sí | ✅ Sí | ⚠️ Parcial |

---

# 🎓 **Para tu documentación del proyecto**

## **Descripción técnica (para reportes):**

### **Arquitectura de Despliegue:**

```
FoodLink utiliza una arquitectura moderna de Progressive Web App (PWA) 
con las siguientes características:

1. **Frontend:** 
   - Framework: Next.js 14 con React 18
   - Lenguaje: TypeScript
   - Estilos: Tailwind CSS

2. **Backend:**
   - Base de datos: Cloud Firestore (Firebase)
   - Autenticación: Firebase Authentication
   - Storage: Firebase Storage

3. **Despliegue:**
   - Plataforma: Vercel (Cloud Computing)
   - CI/CD: Automático con Git
   - CDN: Global (Vercel Edge Network)
   - HTTPS: Automático

4. **APK Generation:**
   - Herramienta: PWA Builder
   - Encapsulación: WebView nativo de Android
   - Service Worker: Caché offline
   - Notificaciones: Web Push API

5. **Características Técnicas:**
   - Responsive Design (Mobile-First)
   - Offline-First con Service Workers
   - Progressive Enhancement
   - Lazy Loading de componentes
   - Code Splitting automático
```

### **Ventajas de esta arquitectura:**

```
✅ Desarrollo más rápido (un solo código para web y móvil)
✅ Mantenimiento simplificado (una sola base de código)
✅ Actualizaciones instantáneas (sin reinstalar)
✅ Escalabilidad automática (Vercel + Firebase)
✅ Multiplataforma (Android, iOS, Web)
✅ Costos reducidos (infraestructura serverless)
```

---

# 🐛 **Solución de Problemas Comunes**

## **Problema 1: Vercel no despliega**

**Error:** `Missing environment variables`

**Solución:**
1. Verifica que `.env` existe y tiene todas las variables
2. Configura las variables en Vercel Dashboard
3. Redespliega: `vercel --prod`

---

## **Problema 2: PWA Builder da error**

**Error:** `Service Worker not found`

**Solución:**
1. Verifica que `public/sw.js` existe
2. Verifica que la app está desplegada en HTTPS
3. Limpia caché del navegador
4. Intenta de nuevo

---

## **Problema 3: APK no instala**

**Error:** `App not installed`

**Solución:**
1. Habilita "Instalar desde fuentes desconocidas"
2. Ve a Ajustes → Seguridad → Permitir instalación de apps desconocidas
3. Activa para "Archivos" o "Chrome"
4. Intenta instalar nuevamente

---

## **Problema 4: Firebase no funciona en el APK**

**Error:** No se puede conectar a Firebase

**Solución:**
1. Verifica que las variables de entorno están en Vercel
2. Redespliega: `vercel --prod`
3. En Firebase Console → Authentication → Settings
4. Agrega tu dominio de Vercel a "Authorized domains"
5. Genera nuevo APK con PWA Builder

---

## **Problema 5: APK pesa mucho (>50 MB)**

**Solución:**
- El APK de PWA Builder es ligero (~10-20 MB)
- Si pesa más, puede ser que:
  - Tienes muchas imágenes sin optimizar
  - Usa herramientas online para comprimir imágenes
  - Considera usar next/image (ya está configurado)

---

# 📞 **Recursos Adicionales**

## **Documentación Oficial:**
- PWA Builder: https://docs.pwabuilder.com/
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs
- Firebase: https://firebase.google.com/docs

## **Tutoriales en Video:**
- PWA Builder: https://www.youtube.com/c/PWABuilder
- Vercel Deployment: https://www.youtube.com/c/Vercel

## **Comunidad:**
- Stack Overflow: Tag `pwa` y `vercel`
- Discord de Next.js: https://nextjs.org/discord

---

# ✅ **Checklist Final para Entrega**

## **Antes de entregar, verifica:**

### **Funcionalidad:**
- [ ] APK instala correctamente
- [ ] App abre sin crashes
- [ ] Login/Registro funciona
- [ ] Firebase guarda datos
- [ ] Todas las funcionalidades principales funcionan
- [ ] Probado en al menos 1 dispositivo Android

### **Archivos para entregar:**
- [ ] APK (`foodlink.apk`)
- [ ] URL pública funcionando
- [ ] README con instrucciones
- [ ] Credenciales de prueba (si aplica)
- [ ] Documentación técnica (si se requiere)

### **Documentación:**
- [ ] Descripción del proyecto
- [ ] Tecnologías utilizadas
- [ ] Instrucciones de instalación
- [ ] Screenshots de la app (opcional)

### **Presentación (si aplica):**
- [ ] Demo del APK funcionando
- [ ] Demo de la URL web
- [ ] Explicación de la arquitectura
- [ ] Ventajas del enfoque PWA

---

# 🎯 **Resumen: Todo el proceso en una página**

```bash
# PASO 1: DESPLEGAR EN VERCEL (5 min)
npm install -g vercel
vercel login
vercel --prod
# → Obtienes URL: https://foodlink-xyz.vercel.app

# PASO 2: CONFIGURAR VARIABLES
# → Ve a Vercel Dashboard
# → Settings → Environment Variables
# → Agrega todas las NEXT_PUBLIC_*
# → Redespliega: vercel --prod

# PASO 3: GENERAR APK (5 min)
# → Ve a https://www.pwabuilder.com/
# → Pega tu URL de Vercel
# → Click "Start"
# → Click "Package For Stores"
# → Selecciona "Android"
# → Configura (Package ID: com.foodlink.app)
# → Click "Generate"
# → Descarga el .zip
# → Extrae el APK

# PASO 4: INSTALAR Y PROBAR
# → Transfiere APK a tu Android
# → Instala
# → Prueba todas las funcionalidades

# ✅ LISTO PARA ENTREGAR
```

---

# 🎓 **Mensaje Final**

Este método es **perfecto para tu proyecto escolar** porque:

1. ⏱️ **Rápido** - 15 minutos y listo
2. 🎯 **Cumple requisitos** - APK funcional
3. ✨ **Profesional** - Herramientas de la industria
4. 💰 **Gratis** - Sin costos
5. 📱 **Funciona** - Garantizado
6. 🌐 **Bonus** - URL pública adicional

**¡Éxito con tu proyecto!** 🚀

Si tienes algún problema durante el proceso, puedes:
- Revisar la sección "Solución de Problemas"
- Buscar en Stack Overflow
- Consultar la documentación oficial

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.0  
**Autor:** Equipo FoodLink

