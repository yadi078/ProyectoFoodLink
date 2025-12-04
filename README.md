# 🍲 FoodLink

## Descripción del Proyecto

FoodLink es una aplicación que busca resolver el problema de los estudiantes universitarios que no tienen acceso a comida casera, nutritiva y económica cerca de su universidad. La plataforma conecta a estos estudiantes con familias y microemprendedores locales que preparan comida casera, permitiéndoles consultar menús diarios, hacer pedidos anticipados y elegir entre recolección o entrega a domicilio.

## 🚀 Tecnologías

- **Framework**: Next.js 14 (React 18)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Backend/Cloud**: Firebase (Authentication + Firestore)
- **Validación**: Zod + React Hook Form
- **Versión**: 4.0.0

## 📋 Requisitos Previos

- **Git** instalado en tu computadora ([Descargar Git](https://git-scm.com/downloads))
- **Node.js 18+** instalado ([Descargar Node.js](https://nodejs.org/))
- **npm** o **yarn** (viene incluido con Node.js)
- Cuenta de Firebase (para configurar las variables de entorno)
- Acceso al repositorio de GitHub (URL: https://github.com/yadi078/ProyectoFoodLink.git)

## 🔧 Instalación - Guía Paso a Paso para Clonar el Repositorio

### Paso 1: Verificar que Git esté instalado

Abre una terminal (PowerShell en Windows, Terminal en Mac/Linux) y ejecuta:

```bash
git --version
```

Si Git no está instalado, descárgalo desde [https://git-scm.com/downloads](https://git-scm.com/downloads) e instálalo.

### Paso 2: Clonar el repositorio

1. **Abre una terminal** (PowerShell, CMD, o Terminal según tu sistema operativo)

2. **Navega a la carpeta donde quieres guardar el proyecto**. Por ejemplo:

   **Windows:**

   ```bash
   cd C:\DesarrolloWebIntegral10B
   ```

   **Mac/Linux:**

   ```bash
   cd ~/DesarrolloWebIntegral10B
   ```

3. **Clona el repositorio** usando el siguiente comando:

   ```bash
   git clone https://github.com/yadi078/ProyectoFoodLink.git
   ```

4. **Ingresa a la carpeta del proyecto**:

   ```bash
   cd ProyectoFoodLink
   ```

### Paso 3: Verificar que tienes la última versión

Después de clonar, asegúrate de tener la última versión del repositorio:

```bash
# Verificar la rama actual
git branch

# Cambiar a la rama principal (main)
git checkout main

# Obtener los últimos cambios del repositorio remoto
git pull origin main
```

**Nota**: Si prefieres trabajar en la rama `develop`, usa:

```bash
git checkout develop
git pull origin develop
```

### Paso 4: Instalar las dependencias del proyecto

Una vez dentro de la carpeta del proyecto, instala todas las dependencias necesarias:

```bash
npm install
```

Este proceso puede tardar unos minutos. Espera a que termine completamente.

### Paso 5: Verificar que todo esté instalado correctamente

Puedes verificar que todo esté bien ejecutando:

```bash
# Verificar la versión de Node.js (debe ser 18 o superior)
node --version

# Verificar que las dependencias estén instaladas
npm list --depth=0
```

### Paso 6: Configurar variables de entorno

Copia el archivo `.env.example` y crea un archivo `.env` con tus credenciales de Firebase:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# O crea manualmente .env con el siguiente contenido:
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ENV=development
```

**Nota**: Obtén estas credenciales desde la [Consola de Firebase](https://console.firebase.google.com/)

### Paso 7: Configurar Firebase

1. **Crea un proyecto en Firebase Console**:

   - Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente

2. **Habilita Authentication**:

   - En el menú lateral, ve a "Authentication"
   - Haz clic en "Comenzar" o "Get Started"
   - Ve a la pestaña "Sign-in method"
   - Habilita "Email/Password"

3. **Crea una base de datos Firestore**:

   - En el menú lateral, ve a "Firestore Database"
   - Haz clic en "Crear base de datos"
   - Selecciona modo "Producción" o "Prueba" (para desarrollo puedes usar "Prueba")
   - Selecciona una ubicación para tu base de datos

4. **Configura las reglas de seguridad**:

   - En Firestore Database, ve a la pestaña "Rules"
   - Copia el contenido del archivo `firestore.rules` de este proyecto
   - Pégalo en el editor de Firebase Console
   - Haz clic en "Publicar" o "Publish"

5. **Obtén las credenciales de configuración**:

   - Ve a Configuración del proyecto (ícono de engranaje)
   - Ve a "Configuración del proyecto"
   - Baja hasta "Tus aplicaciones" y selecciona la opción web (ícono `</>`)
   - Copia las credenciales que aparecen

6. **Crea el archivo `.env`** en la raíz del proyecto con el siguiente contenido:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_ENV=development
```

**⚠️ IMPORTANTE**: Reemplaza todos los valores que dicen "tu\_..." con tus credenciales reales de Firebase.

### Paso 8: Crear Índices en Firestore (CRÍTICO) 🔥

**Sin estos índices, algunas funciones NO funcionarán** (especialmente el chat).

#### Opción Automática (Recomendada):
1. Ejecuta la aplicación
2. Navega por todas las secciones (especialmente `/mensajes`)
3. Abre la consola del navegador (F12)
4. Si ves errores de Firebase sobre índices faltantes, copia el link que aparece en el error
5. Pega el link en el navegador - Firebase creará el índice automáticamente

#### Índice Crítico (Manual):
Si no ves el error, crea este índice manualmente en Firebase Console:

**Colección: `mensajes`**
- Campo 1: `conversacionId` (Ascending)
- Campo 2: `createdAt` (Ascending)

**📖 Consulta el archivo `INDICES_FIRESTORE.md` para la lista completa de índices** o `SOLUCION_RAPIDA_CHAT.md` si el chat no funciona.

## 🔄 Actualizar el Repositorio a la Última Versión

Si ya tienes el repositorio clonado y quieres actualizarlo a la última versión:

1. **Abre una terminal** en la carpeta del proyecto
2. **Asegúrate de no tener cambios sin guardar** (o guárdalos con `git stash`)
3. **Ejecuta los siguientes comandos**:

```bash
# Cambiar a la rama principal
git checkout main

# Obtener los últimos cambios del repositorio remoto
git fetch origin

# Actualizar tu código local con los últimos cambios
git pull origin main
```

Si hay conflictos, Git te lo indicará y deberás resolverlos manualmente.

**Si estás trabajando en otra rama** (por ejemplo, `develop`):

```bash
git checkout develop
git pull origin develop
```

## 🏃 Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Modo Producción

```bash
npm run build
npm start
```

### Linter

```bash
npm run lint
```

### Verificación de Tipos

```bash
npm run type-check
```

## 📁Estructura del Proyecto

```
Proyecto FoodLink/
├── src/
│   ├── app/                    # Rutas y páginas (Next.js App Router)
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Página de inicio
│   │   ├── globals.css         # Estilos globales
│   │   └── vendedor/           # Rutas de vendedor
│   │       ├── login/          # Página de login
│   │       ├── signup/         # Página de registro
│   │       └── dashboard/      # Panel de vendedor
│   ├── components/             # Componentes reutilizables
│   │   └── auth/               # Componentes de autenticación
│   │       ├── LoginForm.tsx
│   │       └── SignupForm.tsx
│   ├── lib/                    # Librerías y configuraciones
│   │   └── firebase/           # Configuración de Firebase
│   │       ├── config.ts       # Inicialización de Firebase
│   │       └── types.ts        # Tipos de Firebase
│   ├── services/               # Lógica de negocio
│   │   └── auth/               # Servicios de autenticación
│   │       └── authService.ts  # Servicio de autenticación
│   ├── hooks/                  # React Hooks personalizados
│   │   └── useAuth.ts          # Hook de autenticación
│   └── utils/                  # Utilidades
│       └── validators/         # Validadores
│           └── authValidators.ts # Validadores de autenticación
├── .env.example                # Ejemplo de variables de entorno
├── next.config.js              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias del proyecto
```

## 🔐 Seguridad Implementada

### Principios de Codificación Segura

1. **Validación de Entradas Estricta**:

   - Validación de formularios con Zod
   - Validación de email, contraseñas fuertes
   - Sanitización de datos de entrada

2. **Conexión Segura (HTTPS)**:

   - Firebase maneja automáticamente HTTPS
   - Todas las comunicaciones son seguras

3. **Tokens de Sesión Segura (JWT)**:

   - Firebase Authentication proporciona tokens JWT automáticamente
   - Tokens se renuevan automáticamente
   - Tokens se almacenan de forma segura en el cliente

4. **Variables de Entorno**:
   - Todas las credenciales de Firebase están en variables de entorno
   - Archivo `.env` está en `.gitignore`
   - Validación de variables de entorno en tiempo de ejecución

## 🗂️ Estructura Modular

El proyecto está organizado en capas claramente separadas:

- **Lógica de UI (Componentes)**: Componentes React en `src/components/`
- **Lógica de Negocio (Servicios)**: Servicios en `src/services/`
- **Lógica de Datos (Firebase)**: Configuración e interacción con Firebase en `src/lib/firebase/`

Esta separación facilita la futura migración a una aplicación móvil nativa o híbrida.

## 📱 Diseño Responsivo

Toda la aplicación está diseñada para ser completamente responsiva, adaptándose a:

- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Escritorio (1024px+)

## 🔄 Git y Versionamiento

### Ramas del Repositorio

- `main`: Rama principal (producción)
- `develop`: Rama de desarrollo
- `feature/auth-vendedor`: Rama para el módulo de autenticación

### Versionamiento Semántico

El proyecto sigue [Semantic Versioning](https://semver.org/):

- **v1.0.0**: Versión inicial con módulo de autenticación de vendedores

## 📝 Funcionalidades Actuales (v4.0.0)

### Para Estudiantes
- ✅ Ver menú de platillos disponibles
- ✅ Filtrar platillos por categoría
- ✅ Carrito de compras
- ✅ Realizar pedidos
- ✅ Ver historial de pedidos
- ✅ Calificar platillos y vendedores
- ✅ Sistema de chat con vendedores
- ✅ Aplicar códigos promocionales

### Para Vendedores
- ✅ Registro e inicio de sesión (`/vendedor/signup`, `/vendedor/login`)
- ✅ Panel de control con estadísticas (`/vendedor/dashboard`)
- ✅ Gestión de menú y platillos (`/vendedor/menu`)
- ✅ Gestión de pedidos (`/vendedor/ordenes`)
- ✅ Ver y responder reseñas (`/vendedor/resenas`)
- ✅ Sistema de chat con clientes (`/vendedor/mensajes`)
- ✅ Configuración de perfil (`/vendedor/configuracion`)
- ✅ Crear y gestionar promociones

### Funcionalidades Generales
- ✅ Validación estricta de formularios
- ✅ Manejo seguro de sesiones con Firebase
- ✅ Interfaz totalmente responsiva
- ✅ PWA (Progressive Web App)
- ✅ Notificaciones push
- ✅ Sistema de calificaciones y reseñas
- ✅ Sobre Nosotros y Contacto
- ✅ Preguntas Frecuentes

## 🚧 Mejoras Futuras

- [ ] Integración de pagos en línea
- [ ] Seguimiento en tiempo real de pedidos
- [ ] Sistema de reportes avanzados
- [ ] Modo oscuro
- [ ] Multi-idioma

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

## 👥 Desarrollo

Este proyecto está en desarrollo activo como parte de un curso de Desarrollo Web Integral.

---

**Versión**: 4.0.0  
**Última actualización**: Diciembre 2024
