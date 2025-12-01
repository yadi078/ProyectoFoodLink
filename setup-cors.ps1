# Script para configurar CORS en Firebase Storage
# Reemplaza estos valores con los de tu proyecto Firebase

$PROJECT_ID = "foodlink-17efa"  # Cambia esto por tu PROJECT_ID
$STORAGE_BUCKET = "$PROJECT_ID.appspot.com"  # O usa el valor exacto de NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

Write-Host "🚀 Configurando CORS para Firebase Storage" -ForegroundColor Cyan
Write-Host "📦 Proyecto: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "🪣 Bucket: $STORAGE_BUCKET" -ForegroundColor Yellow
Write-Host ""

# Verificar que gsutil esté instalado
if (-not (Get-Command gsutil -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ERROR: gsutil no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor instala Google Cloud SDK:" -ForegroundColor Yellow
    Write-Host "1. Descarga desde: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    Write-Host "2. Ejecuta el instalador" -ForegroundColor Yellow
    Write-Host "3. Reinicia PowerShell y ejecuta este script nuevamente" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ gsutil encontrado" -ForegroundColor Green
Write-Host ""

# Verificar que el archivo cors.json existe
if (-not (Test-Path "cors.json")) {
    Write-Host "❌ ERROR: No se encontró el archivo cors.json" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivo cors.json encontrado" -ForegroundColor Green
Write-Host ""

# Autenticar (si no está autenticado)
Write-Host "🔐 Verificando autenticación..." -ForegroundColor Yellow
$authStatus = gcloud auth list 2>&1
if ($authStatus -match "No credentialed accounts") {
    Write-Host "⚠️  No estás autenticado. Abriendo navegador para autenticarte..." -ForegroundColor Yellow
    gcloud auth login
} else {
    Write-Host "✅ Ya estás autenticado" -ForegroundColor Green
}
Write-Host ""

# Configurar proyecto
Write-Host "⚙️  Configurando proyecto..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID
Write-Host ""

# Aplicar CORS
Write-Host "📤 Aplicando reglas de CORS al bucket..." -ForegroundColor Yellow
$result = gsutil cors set cors.json "gs://$STORAGE_BUCKET" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ CORS configurado correctamente!" -ForegroundColor Green
    Write-Host ""
    
    # Verificar configuración
    Write-Host "🔍 Verificando configuración aplicada..." -ForegroundColor Yellow
    gsutil cors get "gs://$STORAGE_BUCKET"
    Write-Host ""
    
    Write-Host "🎉 ¡Listo! Ahora puedes subir imágenes desde tu aplicación." -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Reinicia tu servidor de desarrollo (npm run dev)" -ForegroundColor White
    Write-Host "2. Intenta subir una imagen desde el formulario" -ForegroundColor White
    Write-Host "3. Los errores de CORS deberían desaparecer" -ForegroundColor White
} else {
    Write-Host "❌ ERROR al aplicar CORS:" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "- Verifica que el nombre del bucket sea correcto" -ForegroundColor White
    Write-Host "- Verifica que tengas permisos de administrador en el proyecto" -ForegroundColor White
    Write-Host "- Verifica que el bucket exista en Firebase Storage" -ForegroundColor White
}

