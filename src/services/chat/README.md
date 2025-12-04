# Servicio de Chat - Configuración de Firebase

## Índices Requeridos en Firestore

Para que el servicio de chat funcione correctamente, necesitas crear los siguientes índices compuestos en Firebase Firestore:

### 1. Índice para Mensajes

**Colección:** `mensajes`

**Campos:**
- `conversacionId` - Ascending
- `createdAt` - Ascending

**Cómo crearlo:**

1. **Opción A - Usar el link del error (Recomendado):**
   - Cuando veas el error en la consola del navegador, haz clic en el link proporcionado
   - Esto te llevará directamente a la página de Firebase Console para crear el índice
   - Haz clic en "Create Index"

2. **Opción B - Crear manualmente:**
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Selecciona tu proyecto
   - Ve a Firestore Database → Indexes
   - Haz clic en "Create Index"
   - Configura:
     - Collection ID: `mensajes`
     - Fields to index:
       - Campo 1: `conversacionId` → Ascending
       - Campo 2: `createdAt` → Ascending
     - Query scope: Collection
   - Haz clic en "Create"

3. **Opción C - Usar Firebase CLI:**
   ```bash
   firebase firestore:indexes
   ```

### 2. Tiempo de Creación

- Los índices pueden tardar varios minutos en crearse
- Firebase te mostrará el estado del índice en la consola
- Una vez creado, el chat funcionará sin errores

## Errores Comunes

### Error: "The query requires an index"

**Solución:** Crea el índice como se describe arriba.

### Error: "Index building in progress"

**Solución:** Espera unos minutos a que Firebase termine de construir el índice.

## Nota

Si estás desarrollando localmente con el emulador de Firebase, los índices se crean automáticamente. Este problema solo ocurre en producción.

