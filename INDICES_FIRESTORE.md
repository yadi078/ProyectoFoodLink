# Índices de Firestore Necesarios

Este documento lista todos los índices compuestos que necesitas crear en Firebase Firestore para que la aplicación funcione correctamente.

## 🔥 Cómo Crear Índices en Firestore

### Opción 1: Mediante el Error de Firebase (Recomendado)

1. Abre la aplicación en el navegador
2. Abre la consola del navegador (F12)
3. Cuando veas un error de índice, Firebase te mostrará un link directo
4. Haz clic en el link y Firebase creará el índice automáticamente

### Opción 2: Manual desde Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** → **Índices** (pestaña "Indexes")
4. Haz clic en **"Create Index"**
5. Configura los campos según se indica abajo

---

## 📊 Índices Requeridos

### 1. Colección: `mensajes`

**Necesario para**: Sistema de chat - cargar mensajes de una conversación en orden cronológico

**Campos del índice:**

- `conversacionId` → **Ascending**
- `createdAt` → **Ascending**

**Modo de consulta:** Collection

**Ubicación del código:** `src/services/chat/chatService.ts` línea 207-211

---

### 2. Colección: `platillos`

**Necesario para**: Ver platillos del vendedor ordenados por fecha de creación

**Campos del índice:**

- `vendedorId` → **Ascending**
- `createdAt` → **Descending**

**Modo de consulta:** Collection

**Ubicación del código:** `src/services/platillos/platilloService.ts` línea 63-67

**Nota:** El código tiene un fallback que ordena en el cliente si este índice no existe, pero el índice mejora el rendimiento.

---

### 3. Colección: `calificaciones` (Platillos)

**Necesario para**: Obtener calificaciones de un platillo ordenadas por fecha

**Campos del índice:**

- `platilloId` → **Ascending**
- `createdAt` → **Descending**

**Modo de consulta:** Collection

**Ubicación del código:** `src/services/platillos/calificacionService.ts` línea 41-45

**Nota:** El código tiene un fallback que ordena en el cliente si este índice no existe.

---

### 4. Colección: `calificaciones` (Vendedores)

**Necesario para**: Obtener calificaciones de un vendedor ordenadas por fecha

**Campos del índice:**

- `vendedorId` → **Ascending**
- `createdAt` → **Descending**

**Modo de consulta:** Collection

**Ubicación del código:** `src/services/platillos/calificacionService.ts` línea 129-133

**Nota:** El código tiene un fallback que ordena en el cliente si este índice no existe.

---

## 🚨 Índice Crítico (Necesario Inmediatamente)

El índice más importante y que está causando que no funcione el chat es:

```
Colección: mensajes
Campo 1: conversacionId (Ascending)
Campo 2: createdAt (Ascending)
```

**Sin este índice, el apartado de mensajes NO funcionará.**

---

## ✅ Verificar Índices Creados

Una vez que crees los índices:

1. Ve a Firebase Console
2. Firestore Database → Indexes
3. Espera a que el estado cambie de "Building" a "Enabled" (puede tardar unos minutos)
4. Refresca tu aplicación

---

## 🔍 Detectar Qué Índices Faltan

Si no estás seguro de qué índices necesitas:

1. Abre tu aplicación en el navegador
2. Abre la consola del navegador (F12)
3. Navega por todas las secciones de la app
4. Cuando veas un error como:
   ```
   FirebaseError: The query requires an index.
   ```
5. El error incluirá un link directo para crear el índice
6. Haz clic en el link y Firebase lo creará automáticamente

---

## 📝 Ejemplo de Creación Manual

### Crear el índice de mensajes manualmente:

1. Ve a Firebase Console → Tu Proyecto
2. Firestore Database → Pestaña "Indexes"
3. Click en "Create Index"
4. Configura:
   - **Collection ID**: `mensajes`
   - **Fields to index**:
     - Campo 1: `conversacionId` | **Ascending**
     - Campo 2: `createdAt` | **Ascending**
   - **Query scope**: Collection
5. Click en "Create"
6. Espera a que el índice se construya (estado "Enabled")

---

## 🎯 Resumen Rápido

**Índice crítico que necesitas crear AHORA:**

- Colección `mensajes`: `conversacionId` (Asc) + `createdAt` (Asc)

**Índices opcionales pero recomendados:**

- Colección `platillos`: `vendedorId` (Asc) + `createdAt` (Desc)
- Colección `calificaciones`: `platilloId` (Asc) + `createdAt` (Desc)
- Colección `calificaciones`: `vendedorId` (Asc) + `createdAt` (Desc)

---

## ⚠️ Nota Importante

El código actual está optimizado para minimizar la necesidad de índices:

- Muchas consultas se ordenan en el cliente en lugar del servidor
- Esto funciona bien para volúmenes pequeños de datos
- Para producción con muchos datos, considera crear todos los índices recomendados

---

**Última actualización:** Diciembre 2024
