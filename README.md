# 🍲 FoodLink

## Descripción del Proyecto

FoodLink es una aplicación que busca resolver el problema de los estudiantes universitarios que no tienen acceso a comida casera, nutritiva y económica cerca de su universidad. La plataforma conecta a estos estudiantes con familias y microemprendedores locales que preparan comida casera, permitiéndoles consultar menús diarios, hacer pedidos anticipados y elegir entre recolección o entrega a domicilio.

## 🚀 Tecnologías

- **Framework**: Next.js 14 (React 18)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Backend/Cloud**: Firebase (Authentication + Firestore)
- **Validación**: Zod + React Hook Form
- **Versión**: 1.0.0

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase (para configurar las variables de entorno)

## 🔧 Instalación

1. **Clonar el repositorio** (o navegar a la carpeta del proyecto):
```bash
cd "C:\DesarrolloWebIntegral10B\Proyecto FoodLink"
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
   
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

4. **Configurar Firebase**:
   - Crea un proyecto en Firebase Console
   - Habilita Authentication (Email/Password)
   - Crea una base de datos Firestore
   - Copia las credenciales de configuración al archivo `.env`

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

## 📁 Estructura del Proyecto

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

## 📝 Funcionalidades Actuales (v1.0.0)

### Módulo de Autenticación de Vendedores

- ✅ Registro de vendedores (`/vendedor/signup`)
- ✅ Inicio de sesión de vendedores (`/vendedor/login`)
- ✅ Panel de vendedor (`/vendedor/dashboard`)
- ✅ Validación estricta de formularios
- ✅ Manejo seguro de sesiones con Firebase
- ✅ Interfaz responsiva

## 🚧 Próximas Funcionalidades

- [ ] Gestión de menús diarios
- [ ] Sistema de pedidos
- [ ] Perfil de vendedor
- [ ] Notificaciones
- [ ] Gestión de entregas/recolecciones

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

## 👥 Desarrollo

Este proyecto está en desarrollo activo como parte de un curso de Desarrollo Web Integral.

---

**Versión**: 1.0.0  
**Última actualización**: 2024

