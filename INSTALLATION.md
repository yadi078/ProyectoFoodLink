# 🚀 Guía de Instalación Rápida - FoodLink

## Requisitos Previos

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior (o yarn/pnpm)
- **Cuenta de Firebase**: [Crear cuenta aquí](https://console.firebase.google.com/)

## Pasos de Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Firebase

#### 2.1 Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ingresa el nombre: `FoodLink` (o el que prefieras)
4. Sigue los pasos para crear el proyecto

#### 2.2 Configurar Authentication

1. En el panel izquierdo, ve a **Build** > **Authentication**
2. Haz clic en **Get started**
3. En la pestaña **Sign-in method**, habilita:
   - **Email/Password** (Habilitar y guardar)

#### 2.3 Configurar Firestore Database

1. En el panel izquierdo, ve a **Build** > **Firestore Database**
2. Haz clic en **Create database**
3. Selecciona **Start in test mode** (para desarrollo)
4. Elige la ubicación más cercana
5. Haz clic en **Enable**

#### 2.4 Obtener Credenciales de Configuración

1. En el panel izquierdo, ve a **Project Overview** (ícono de engranaje) > **Project settings**
2. Desplázate hasta **Your apps** y haz clic en el ícono **</>** (Web)
3. Registra la app con el nombre `FoodLink Web`
4. Copia las credenciales que aparecen

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Windows PowerShell
New-Item .env.local -ItemType File

# O crea el archivo manualmente
```

Copia el siguiente contenido y reemplaza con tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_ENV=development
```

### 4. Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

## Verificar la Instalación

1. Abre [http://localhost:3000](http://localhost:3000)
2. Deberías ver la página de inicio de FoodLink
3. Haz clic en "Registrarse como Vendedor"
4. Completa el formulario de registro
5. Deberías ser redirigido al dashboard

## Solución de Problemas

### Error: "Faltan variables de entorno de Firebase"

- Verifica que el archivo `.env.local` existe en la raíz del proyecto
- Verifica que todas las variables están definidas correctamente
- Asegúrate de que las variables comienzan con `NEXT_PUBLIC_`
- Reinicia el servidor de desarrollo después de crear/modificar `.env.local`

### Error: "Firebase: Error (auth/invalid-api-key)"

- Verifica que copiaste correctamente la API Key de Firebase
- Asegúrate de que no hay espacios adicionales en el archivo `.env.local`

### Error: "Module not found"

- Ejecuta `npm install` nuevamente
- Verifica que todas las dependencias están instaladas correctamente

### La página carga pero los formularios no funcionan

- Abre la consola del navegador (F12) y verifica errores
- Verifica que Firebase está configurado correctamente
- Verifica que Authentication está habilitado en Firebase Console

## Próximos Pasos

Una vez instalado correctamente:

1. Revisa el [README.md](./README.md) para más información
2. Revisa [SECURITY.md](./SECURITY.md) para medidas de seguridad
3. Explora el código en `src/` para entender la estructura
4. Configura las reglas de seguridad de Firestore (ver SECURITY.md)

---

**¿Problemas?** Revisa la documentación o crea un issue en el repositorio.

