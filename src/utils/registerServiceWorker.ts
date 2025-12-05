/**
 * Utilidad para registrar el Service Worker
 * Maneja el registro, actualizaciones y errores
 */

export interface ServiceWorkerStatus {
  registered: boolean;
  registration?: ServiceWorkerRegistration;
  error?: Error;
}

/**
 * Registra el Service Worker
 * Debe llamarse cuando la página carga
 */
export async function registerServiceWorker(): Promise<ServiceWorkerStatus> {
  // Verificar si el navegador soporta Service Workers
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ Service Workers no soportados en este navegador');
    return {
      registered: false,
      error: new Error('Service Workers no soportados')
    };
  }

  try {
    console.log('🔧 Registrando Service Worker...');

    // Registrar el Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('✅ Service Worker registrado:', registration);

    // Verificar si hay actualizaciones
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('🔄 Nueva versión del Service Worker encontrada');

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nueva versión disponible
            console.log('🆕 Nueva versión disponible. Recarga para actualizar.');
            
            // Auto-recargar después de 3 segundos
            // Esto funciona mejor en APK que confirm()
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        });
      }
    });

    // Manejar cambios de estado del Service Worker
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('🔄 Service Worker actualizado');
        window.location.reload();
      }
    });

    return {
      registered: true,
      registration
    };
  } catch (error) {
    console.error('❌ Error al registrar Service Worker:', error);
    return {
      registered: false,
      error: error as Error
    };
  }
}

/**
 * Desregistra el Service Worker
 * Útil para desarrollo o testing
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const unregistered = await registration.unregister();
    
    if (unregistered) {
      console.log('✅ Service Worker desregistrado');
    }
    
    return unregistered;
  } catch (error) {
    console.error('❌ Error al desregistrar Service Worker:', error);
    return false;
  }
}

/**
 * Obtiene el registro actual del Service Worker
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error('❌ Error al obtener registro del Service Worker:', error);
    return null;
  }
}

/**
 * Verifica si el Service Worker está activo
 */
export function isServiceWorkerActive(): boolean {
  return (
    'serviceWorker' in navigator &&
    navigator.serviceWorker.controller !== null
  );
}

/**
 * Solicita actualización del Service Worker
 */
export async function updateServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    console.log('🔄 Service Worker actualizado');
  } catch (error) {
    console.error('❌ Error al actualizar Service Worker:', error);
  }
}

/**
 * Envía un mensaje al Service Worker
 */
export async function sendMessageToServiceWorker(message: any): Promise<any> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    throw new Error('Service Worker no está activo');
  }

  return new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    }
  });
}

/**
 * Verifica el estado de la red
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Registra listeners para eventos de red
 */
export function setupNetworkListeners(
  onOnline?: () => void,
  onOffline?: () => void
): () => void {
  const handleOnline = () => {
    console.log('🌐 Conectado a Internet');
    onOnline?.();
  };

  const handleOffline = () => {
    console.log('📴 Sin conexión a Internet');
    onOffline?.();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Retornar función de limpieza
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

