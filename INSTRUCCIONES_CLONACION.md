# 📥 Instrucciones Rápidas para Clonar el Repositorio FoodLink

Esta guía te ayudará a clonar el repositorio en tu computadora desde cero.

## ⚡ Pasos Rápidos (Resumen)

1. **Instalar Git** (si no lo tienes): [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. **Instalar Node.js 18+**: [https://nodejs.org/](https://nodejs.org/)
3. **Abrir una terminal** (PowerShell en Windows)
4. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/yadi078/ProyectoFoodLink.git
   ```
5. **Entrar a la carpeta**:
   ```bash
   cd ProyectoFoodLink
   ```
6. **Obtener la última versión**:
   ```bash
   git checkout main
   git pull origin main
   ```
7. **Instalar dependencias**:
   ```bash
   npm install
   ```
8. **Configurar Firebase** (ver sección completa abajo)
9. **Ejecutar el proyecto**:
   ```bash
   npm run dev
   ```

---

## 📋 Guía Detallada

### 1️⃣ Verificar Requisitos Previos

Abre una terminal y verifica:

```bash
# Verificar Git
git --version
# Debe mostrar algo como: git version 2.x.x

# Verificar Node.js
node --version
# Debe mostrar algo como: v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar algo como: 9.x.x o superior
```

**Si no tienes Git o Node.js instalados**, descárgalos e instálalos:
- **Git**: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **Node.js**: [https://nodejs.org/](https://nodejs.org/) (versión LTS recomendada)

### 2️⃣ Elegir una Ubicación para el Proyecto

Decide en qué carpeta quieres guardar el proyecto. Por ejemplo:

**Windows:**
```bash
cd C:\DesarrolloWebIntegral10B
```

**Mac/Linux:**
```bash
cd ~/DesarrolloWebIntegral10B
```

### 3️⃣ Clonar el Repositorio

Ejecuta el siguiente comando para clonar el repositorio:

```bash
git clone https://github.com/yadi078/ProyectoFoodLink.git
```

Esto creará una carpeta llamada `ProyectoFoodLink` con todo el código del proyecto.

### 4️⃣ Entrar a la Carpeta del Proyecto

```bash
cd ProyectoFoodLink
```

### 5️⃣ Asegurarse de Tener la Última Versión

```bash
# Ver en qué rama estás
git branch

# Cambiar a la rama principal (main)
git checkout main

# Obtener la última versión del repositorio
git pull origin main
```

### 6️⃣ Instalar las Dependencias

Este paso descarga e instala todas las librerías necesarias para el proyecto:

```bash
npm install
```

⏱️ **Este proceso puede tardar 2-5 minutos**. Espera a que termine completamente antes de continuar.

### 7️⃣ Configurar Firebase

#### a) Crear/Acceder a Firebase Console

1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Crea un nuevo proyecto o selecciona uno existente

#### b) Habilitar Authentication

1. En el menú lateral, haz clic en **"Authentication"**
2. Haz clic en **"Comenzar"** o **"Get Started"**
3. Ve a la pestaña **"Sign-in method"**
4. Haz clic en **"Email/Password"**
5. Actívalo y haz clic en **"Guardar"**

#### c) Crear Base de Datos Firestore

1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"** (para desarrollo)
4. Selecciona una ubicación (puedes dejar la predeterminada)
5. Haz clic en **"Habilitar"**

#### d) Obtener las Credenciales

1. Ve a **Configuración del proyecto** (ícono de engranaje ⚙️)
2. Baja hasta **"Tus aplicaciones"**
3. Haz clic en el ícono web `</>` para agregar una aplicación web
4. Registra tu aplicación (puedes poner cualquier nombre)
5. **Copia las credenciales** que aparecen en `firebaseConfig`

#### e) Crear el Archivo .env

En la raíz del proyecto (dentro de la carpeta `ProyectoFoodLink`), crea un archivo llamado `.env` con el siguiente contenido:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_ENV=development
```

**⚠️ IMPORTANTE**: 
- Reemplaza todos los valores que dicen `tu_...` con tus credenciales reales de Firebase
- No compartas este archivo `.env` con nadie (está en `.gitignore`)

### 8️⃣ Ejecutar el Proyecto

Ahora ya puedes ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Espera unos segundos y luego abre tu navegador en:
**http://localhost:3000**

¡Listo! 🎉 El proyecto debería estar funcionando.

---

## 🔄 Actualizar el Repositorio (Si Ya Lo Tienes Clonado)

Si ya tienes el proyecto clonado y quieres actualizarlo a la última versión:

```bash
# 1. Entrar a la carpeta del proyecto
cd ProyectoFoodLink

# 2. Cambiar a la rama principal
git checkout main

# 3. Obtener los últimos cambios
git pull origin main

# 4. Si hay nuevas dependencias, actualizar
npm install

# 5. Si cambió la estructura de .env, actualizar tu archivo .env
```

**Si tienes cambios sin guardar** y Git no te deja actualizar:

```bash
# Opción 1: Guardar tus cambios temporalmente
git stash
git pull origin main
git stash pop

# Opción 2: Hacer commit de tus cambios primero
git add .
git commit -m "Mis cambios"
git pull origin main
```

---

## ❓ Solución de Problemas Comunes

### Error: "git: command not found"
**Solución**: Instala Git desde [https://git-scm.com/downloads](https://git-scm.com/downloads)

### Error: "node: command not found"
**Solución**: Instala Node.js desde [https://nodejs.org/](https://nodejs.org/)

### Error: "npm: command not found"
**Solución**: npm viene con Node.js. Reinstala Node.js si npm no funciona.

### Error: "Permission denied" al clonar
**Solución**: 
- En Windows: Ejecuta PowerShell como Administrador
- En Mac/Linux: Verifica los permisos de la carpeta de destino

### Error: "Port 3000 is already in use"
**Solución**: 
- Cierra otros proyectos que estén usando el puerto 3000
- O cambia el puerto: `npm run dev -- -p 3001`

### Error: "Cannot find module..."
**Solución**: Ejecuta nuevamente `npm install`

### El proyecto no carga / Error de Firebase
**Solución**: 
- Verifica que el archivo `.env` existe y tiene las credenciales correctas
- Verifica que Firebase esté correctamente configurado
- Verifica que Authentication y Firestore estén habilitados en Firebase Console

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas al seguir estos pasos:

1. Verifica que tengas todas las herramientas instaladas (Git, Node.js, npm)
2. Revisa la sección de "Solución de Problemas Comunes" arriba
3. Pregunta a tus compañeras de equipo
4. Revisa el README.md principal del proyecto para más información

---

**¡Buena suerte con el proyecto! 🚀**

