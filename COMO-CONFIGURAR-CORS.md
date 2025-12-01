# 🔧 Cómo Configurar CORS en Google Cloud Storage

## 📍 Dónde Encontrar la Configuración CORS

En la consola de Google Cloud Storage, la sección CORS puede estar en diferentes lugares dependiendo de la versión de la interfaz:

### Opción 1: En la Pestaña Configuration (Más Común)

1. **Ve a tu bucket:** `foodlink-17efa.firebasestorage.app`
2. **Haz clic en la pestaña "Configuration"**
3. **Haz scroll hacia abajo** - La sección CORS suele estar después de "Protection"
4. **Busca una sección llamada "CORS"** o "Cross-origin resource sharing (CORS)"

Si no la ves, intenta:

### Opción 2: Usar gsutil (Más Confiable)

Si tienes `gsutil` instalado, es la forma más directa:

```bash
# Verificar si CORS está configurado
gsutil cors get gs://foodlink-17efa.firebasestorage.app

# Si no muestra nada o está vacío, aplicar CORS
gsutil cors set cors.json gs://foodlink-17efa.firebasestorage.app

# Verificar que se aplicó
gsutil cors get gs://foodlink-17efa.firebasestorage.app
```

### Opción 3: Buscar en la Interfaz

1. En la pestaña **Configuration**, busca un botón o enlace que diga:

   - "Edit CORS configuration"
   - "CORS"
   - "Cross-origin resource sharing"
   - O un ícono de engranaje/configuración

2. Si no lo encuentras, intenta:
   - Haz clic en "Edit" en cualquier sección y busca CORS
   - O ve directamente a: `https://console.cloud.google.com/storage/browser/foodlink-17efa.firebasestorage.app;tab=configuration`

## ✅ Configuración CORS Correcta

Tu archivo `cors.json` debe tener:

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

## 🚀 Pasos Rápidos con gsutil

Si tienes Google Cloud SDK instalado:

```powershell
# 1. Autenticarte (si no lo has hecho)
gcloud auth login

# 2. Configurar el proyecto
gcloud config set project foodlink-17efa

# 3. Aplicar CORS
gsutil cors set cors.json gs://foodlink-17efa.firebasestorage.app

# 4. Verificar
gsutil cors get gs://foodlink-17efa.firebasestorage.app
```

## 🔍 Verificar que Funciona

Después de configurar CORS:

1. **Espera 1-2 minutos** (puede tardar en propagarse)

2. **Reinicia tu servidor:**

   ```bash
   npm run dev
   ```

3. **Limpia la caché del navegador:**

   - `Ctrl + Shift + R` (recarga forzada)

4. **Intenta subir una imagen**

5. **Revisa la consola del navegador** - Los errores de CORS deberían desaparecer

## ⚠️ Si No Tienes gsutil Instalado

### Instalar Google Cloud SDK (Windows):

1. Descarga desde: https://cloud.google.com/sdk/docs/install
2. Ejecuta el instalador
3. Reinicia PowerShell
4. Verifica: `gsutil --version`

### O Usar la Consola Web:

1. Ve a: https://console.cloud.google.com/storage/browser/foodlink-17efa.firebasestorage.app
2. Haz clic en la pestaña **Configuration**
3. Busca la sección **CORS** (puede estar al final, haz scroll)
4. Haz clic en **Edit** o **Add CORS configuration**
5. Pega el JSON de `cors.json`
6. Guarda

## 🐛 Solución de Problemas

### "No veo la sección CORS"

- **Haz scroll hacia abajo** en la pestaña Configuration
- **Busca en otras pestañas** como "Settings" o "Permissions"
- **Usa gsutil** (más confiable)

### "Los errores persisten después de configurar"

1. Verifica que aplicaste CORS al bucket correcto: `foodlink-17efa.firebasestorage.app`
2. Espera 2-3 minutos (puede tardar en propagarse)
3. Limpia la caché del navegador completamente
4. Verifica que tu `.env` tenga: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=foodlink-17efa.firebasestorage.app`
5. Reinicia el servidor de desarrollo

### "Error al aplicar CORS con gsutil"

- Verifica que estés autenticado: `gcloud auth login`
- Verifica que tengas permisos de administrador en el proyecto
- Verifica que el bucket exista: `gsutil ls gs://foodlink-17efa.firebasestorage.app`
