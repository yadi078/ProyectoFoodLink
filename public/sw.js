/**
 * Service Worker para FoodLink
 * Maneja notificaciones push en dispositivos móviles
 * Gestiona clics y redirecciones correctamente
 */

const CACHE_NAME = 'foodlink-v1';
const urlsToCache = [
  '/',
  '/menu',
  '/vendedor/dashboard',
  '/offline.html'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Service Worker: Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('❌ Error al cachear archivos:', error);
      })
  );
  
  // Forzar activación inmediata
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Tomar control inmediato de todos los clientes
  return self.clients.claim();
});

// Manejo de fetch (caché first, luego red)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - devolver respuesta del cache
        if (response) {
          return response;
        }
        
        // Clone la solicitud
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Verificar si recibimos una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone la respuesta
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch((error) => {
          console.error('❌ Error en fetch:', error);
          
          // Si falla, intentar mostrar página offline
          return caches.match('/offline.html');
        });
      })
  );
});

/**
 * MANEJO DE NOTIFICACIONES PUSH
 * Esta es la parte crítica para móviles
 */

// Mostrar notificación cuando llega un mensaje push
self.addEventListener('push', (event) => {
  console.log('📬 Service Worker: Push recibido');
  
  let notificationData = {
    title: 'FoodLink',
    body: 'Nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {}
  };
  
  // Intentar parsear los datos del push
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        tag: data.tag || 'default',
        data: data.data || {},
        requireInteraction: data.requireInteraction || false,
        vibrate: data.vibrate || [200, 100, 200], // Patrón de vibración
        silent: data.silent || false
      };
    } catch (error) {
      console.error('❌ Error al parsear datos del push:', error);
    }
  }
  
  // Mostrar la notificación
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      requireInteraction: notificationData.requireInteraction,
      vibrate: notificationData.vibrate,
      silent: notificationData.silent,
      actions: [
        {
          action: 'open',
          title: 'Abrir',
          icon: '/icons/action-open.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/icons/action-close.png'
        }
      ]
    })
  );
});

/**
 * MANEJO DE CLICS EN NOTIFICACIONES
 * Esta es la función MÁS IMPORTANTE para móviles
 */
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Click en notificación');
  
  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};
  
  // Cerrar la notificación
  notification.close();
  
  // Si el usuario hace clic en "Cerrar", no hacer nada más
  if (action === 'close') {
    console.log('👋 Usuario cerró la notificación');
    return;
  }
  
  // Determinar la URL de destino
  let urlToOpen = '/';
  
  if (data.url) {
    urlToOpen = data.url;
  } else if (data.pedidoId) {
    // Si es vendedor, ir a pedidos del vendedor
    urlToOpen = `/vendedor/pedidos/${data.pedidoId}`;
  } else if (data.productoId) {
    urlToOpen = `/menu?producto=${data.productoId}`;
  } else if (data.vendedorId) {
    urlToOpen = `/mensajes?vendedor=${data.vendedorId}`;
  } else if (data.type === 'mensaje') {
    urlToOpen = '/mensajes';
  }
  
  console.log('🔗 Redirigiendo a:', urlToOpen);
  
  // Abrir o enfocar la URL
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((clientList) => {
      // Buscar si ya hay una ventana abierta con la app
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        
        // Si encontramos una ventana de la app, navegar ahí
        if (client.url.includes(self.location.origin)) {
          console.log('✅ Ventana existente encontrada, navegando...');
          return client.navigate(urlToOpen).then(client => client.focus());
        }
      }
      
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        console.log('🆕 Abriendo nueva ventana...');
        return clients.openWindow(urlToOpen);
      }
    })
    .catch((error) => {
      console.error('❌ Error al abrir ventana:', error);
    })
  );
});

/**
 * MANEJO DE CIERRE DE NOTIFICACIONES
 */
self.addEventListener('notificationclose', (event) => {
  console.log('👋 Service Worker: Notificación cerrada');
  
  const notification = event.notification;
  const data = notification.data || {};
  
  // Aquí puedes enviar analytics o hacer tracking
  console.log('Notificación cerrada sin interacción:', data);
});

/**
 * MANEJO DE SINCRONIZACIÓN EN BACKGROUND
 * Para cuando el usuario está offline
 */
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Sincronización solicitada');
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  console.log('📤 Sincronizando notificaciones pendientes...');
  
  try {
    // Aquí puedes implementar lógica para enviar notificaciones pendientes
    // cuando el usuario vuelve a estar online
    
    // Obtener notificaciones pendientes de IndexedDB o localStorage
    const pendingNotifications = await getPendingNotifications();
    
    if (pendingNotifications.length > 0) {
      console.log(`📬 ${pendingNotifications.length} notificaciones pendientes`);
      
      for (const notification of pendingNotifications) {
        await self.registration.showNotification(notification.title, notification.options);
      }
      
      // Limpiar notificaciones pendientes
      await clearPendingNotifications();
    }
  } catch (error) {
    console.error('❌ Error al sincronizar notificaciones:', error);
  }
}

// Helper: Obtener notificaciones pendientes
async function getPendingNotifications() {
  // Implementar lógica para obtener de IndexedDB
  // Por ahora retornamos array vacío
  return [];
}

// Helper: Limpiar notificaciones pendientes
async function clearPendingNotifications() {
  // Implementar lógica para limpiar IndexedDB
  console.log('🗑️ Notificaciones pendientes limpiadas');
}

/**
 * MANEJO DE ERRORES GLOBALES
 */
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker Unhandled Rejection:', event.reason);
});

console.log('✅ Service Worker cargado correctamente');

