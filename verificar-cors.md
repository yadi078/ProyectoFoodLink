# 🔍 Verificar y Solucionar Problemas de CORS

## ⚠️ Problema Común

Si ya configuraste CORS pero los errores persisten, puede ser por:

1. **Bucket incorrecto** - Tu bucket es `foodlink-17efa.firebasestorage.app` (no `appspot.com`)
2. **CORS no aplicado correctamente** - Necesitas verificar que se aplicó
3. **Variable de entorno incorrecta** - El `storageBucket` en `.env` debe coincidir

## ✅ Pasos para Verificar

### 1. Verificar tu archivo `.env`

Abre tu archivo `.env` y verifica que `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` sea:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=foodlink-17efa.firebasestorage.app
```

**NO** debe ser `foodlink-17efa.appspot.com`

### 2. Verificar CORS en la Consola de Google Cloud

1. Ve a: https://console.cloud.google.com/storage/browser
2. Selecciona tu bucket: `foodlink-17efa.firebasestorage.app`
3. Haz clic en la pestaña **Configuration**
4. Busca la sección **CORS**
5. Debe mostrar algo como:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
```

### 3. Si CORS no está configurado, aplícalo manualmente

En la pestaña **Configuration** de tu bucket:

1. Haz clic en **Edit CORS configuration**
2. Pega este JSON:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
```

3. Haz clic en **Save**

### 4. Verificar con gsutil (si lo tienes instalado)

```bash
gsutil cors get gs://foodlink-17efa.firebasestorage.app
```

Debería mostrar tu configuración de CORS.

### 5. Aplicar CORS con gsutil (si no está configurado)

```bash
gsutil cors set cors.json gs://foodlink-17efa.firebasestorage.app
```

## 🔄 Después de Configurar

1. **Reinicia tu servidor de desarrollo:**
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   ```

2. **Limpia la caché del navegador:**
   - Presiona `Ctrl + Shift + R` (Windows/Linux)
   - O `Cmd + Shift + R` (Mac)

3. **Intenta subir una imagen nuevamente**

## 🐛 Si los errores persisten

### Verificar en la Consola del Navegador

1. Abre las **DevTools** (F12)
2. Ve a la pestaña **Network**
3. Intenta subir una imagen
4. Busca la petición que falla
5. Revisa los headers de la respuesta

### Verificar que el bucket sea correcto

En la consola del navegador, busca errores que mencionen el bucket. Debe ser:
- ✅ `foodlink-17efa.firebasestorage.app`
- ❌ NO `foodlink-17efa.appspot.com`

### Verificar las Reglas de Seguridad de Storage

1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona tu proyecto
3. Ve a **Storage** > **Rules**
4. Debe tener reglas que permitan lectura/escritura (al menos para desarrollo):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📝 Nota Importante

Firebase tiene **dos tipos de buckets**:
- `project-id.appspot.com` - Bucket por defecto (más antiguo)
- `project-id.firebasestorage.app` - Bucket de Firebase Storage (nuevo, recomendado)

Tu proyecto usa `firebasestorage.app`, así que asegúrate de configurar CORS en ese bucket específico.

