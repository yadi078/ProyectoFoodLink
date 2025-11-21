# 🔒 Reglas de Seguridad de Firestore - FoodLink

## Configuración de Reglas de Seguridad

Estas reglas deben configurarse en la consola de Firebase para proteger la base de datos.

### Pasos para Configurar:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto FoodLink
3. Ve a **Build** > **Firestore Database**
4. Haz clic en la pestaña **Rules**
5. Copia y pega las reglas siguientes
6. Haz clic en **Publish**

## Reglas de Seguridad Recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Función auxiliar: verificar si el usuario está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }

    // Función auxiliar: verificar si el usuario es el dueño del documento
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Función auxiliar: verificar si el usuario es admin
    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.exists == true;
    }

    // ============================================
    // COLECCIÓN: vendedores
    // ============================================
    match /vendedores/{vendedorId} {
      // Permitir lectura pública: todos pueden ver información de vendedores (para menú público)
      allow read: if true;

      // Permitir escritura: solo el propio vendedor o admin
      allow create: if isOwner(vendedorId);
      allow update: if isOwner(vendedorId) || isAdmin();
      allow delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: estudiantes
    // ============================================
    match /estudiantes/{estudianteId} {
      // Permitir lectura: solo el propio estudiante o admin
      allow read: if isOwner(estudianteId) || isAdmin();

      // Permitir escritura: solo el propio estudiante o admin
      allow create: if isOwner(estudianteId);
      allow update: if isOwner(estudianteId) || isAdmin();
      allow delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: platillos
    // ============================================
    match /platillos/{platilloId} {
      // Permitir lectura pública: todos pueden ver los platillos disponibles (sin autenticación)
      allow read: if true;

      // Permitir escritura: solo el vendedor propietario o admin
      allow create: if isAuthenticated() &&
                       request.resource.data.vendedorId == request.auth.uid;
      allow update: if isAuthenticated() &&
                       (resource.data.vendedorId == request.auth.uid || isAdmin());
      allow delete: if isAuthenticated() &&
                       (resource.data.vendedorId == request.auth.uid || isAdmin());
    }

    // ============================================
    // COLECCIÓN: pedidos
    // ============================================
    match /pedidos/{pedidoId} {
      // Permitir lectura: solo el estudiante o vendedor involucrado, o admin
      allow read: if isAuthenticated() &&
                     (resource.data.estudianteId == request.auth.uid ||
                      resource.data.vendedorId == request.auth.uid ||
                      isAdmin());

      // Permitir crear: cualquier estudiante autenticado
      allow create: if isAuthenticated() &&
                       request.resource.data.estudianteId == request.auth.uid;

      // Permitir actualizar: solo el vendedor del pedido o admin
      allow update: if isAuthenticated() &&
                       (resource.data.vendedorId == request.auth.uid || isAdmin());

      // Permitir eliminar: solo admin
      allow delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: calificaciones
    // ============================================
    match /calificaciones/{calificacionId} {
      // Permitir lectura pública: todos pueden ver las calificaciones (para menú público)
      allow read: if true;

      // Permitir crear: cualquier estudiante autenticado
      allow create: if isAuthenticated() &&
                       request.resource.data.estudianteId == request.auth.uid;

      // Permitir actualizar: solo el estudiante que creó la calificación o admin
      allow update: if isAuthenticated() &&
                       (resource.data.estudianteId == request.auth.uid || isAdmin());

      // Permitir eliminar: solo el estudiante que creó la calificación o admin
      allow delete: if isAuthenticated() &&
                       (resource.data.estudianteId == request.auth.uid || isAdmin());
    }

    // ============================================
    // COLECCIÓN: reportes
    // ============================================
    match /reportes/{reporteId} {
      // Permitir lectura: solo admin
      allow read: if isAdmin();

      // Permitir crear: cualquier usuario autenticado
      allow create: if isAuthenticated();

      // Permitir actualizar: solo admin
      allow update: if isAdmin();

      // Permitir eliminar: solo admin
      allow delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: mensajes_contacto
    // ============================================
    match /mensajes_contacto/{mensajeId} {
      // Permitir lectura: solo admin
      allow read: if isAdmin();

      // Permitir crear: cualquier usuario puede enviar mensajes
      allow create: if true; // Permitir incluso sin autenticación para contactos públicos

      // No permitir actualizar ni eliminar (solo admin puede hacerlo manualmente)
      allow update, delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: admins (solo lectura por admin)
    // ============================================
    match /admins/{adminId} {
      allow read, write: if isAdmin();
    }
  }
}
```

## ⚠️ Notas Importantes

1. **Reglas de Desarrollo vs Producción**:

   - Para desarrollo, puedes usar reglas más permisivas temporalmente
   - **NUNCA** dejes reglas permisivas en producción

2. **Función isAdmin()**:

   - Asegúrate de crear una colección `admins` en Firestore
   - Agrega documentos con el UID de los administradores

3. **Validación de Datos**:

   - Las reglas anteriores validan estructura básica
   - Puedes agregar validaciones más estrictas según tus necesidades

4. **Testing de Reglas**:
   - Usa el simulador de reglas en Firebase Console
   - Prueba cada regla antes de publicarla

## 🔐 Seguridad Adicional

- **Índices**: Crea índices compuestos para consultas complejas
- **Validación de Datos**: Agrega validaciones en el código del cliente también
- **Monitoreo**: Revisa los logs de Firestore regularmente
- **Backups**: Configura backups automáticos de Firestore

---

**Última actualización**: v2.5.0
