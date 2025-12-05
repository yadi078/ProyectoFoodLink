/**
 * Componente de Inicialización del Service Worker
 * Se debe incluir en el layout principal
 */

'use client';

import { useEffect, useState } from 'react';
import { registerServiceWorker, setupNetworkListeners } from '@/utils/registerServiceWorker';

export default function ServiceWorkerInit() {
  const [swStatus, setSwStatus] = useState<'loading' | 'registered' | 'error' | 'unsupported'>('loading');
  const [isOnline, setIsOnline] = useState(true);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // Registrar Service Worker (solo en navegador, no en APK)
    const initServiceWorker = async () => {
      // Detectar si estamos en un APK/WebView
      const isInApp = typeof window !== 'undefined' && (
        // @ts-ignore - Capacitor global
        window.Capacitor !== undefined ||
        // @ts-ignore - Cordova global
        window.cordova !== undefined
      );

      // No inicializar Service Worker en APK (puede causar problemas)
      if (isInApp) {
        console.log('🔧 APK detectado - Service Worker deshabilitado');
        setSwStatus('unsupported');
        return;
      }

      const result = await registerServiceWorker();
      
      if (result.registered) {
        console.log('✅ Service Worker inicializado correctamente');
        setSwStatus('registered');
      } else if (result.error?.message.includes('no soportados')) {
        console.warn('⚠️ Service Worker no soportado');
        setSwStatus('unsupported');
      } else {
        console.error('❌ Error al inicializar Service Worker');
        setSwStatus('error');
      }
    };

    initServiceWorker();

    // Configurar listeners de red
    const cleanupNetworkListeners = setupNetworkListeners(
      () => {
        setIsOnline(true);
        console.log('🌐 Conexión restaurada');
      },
      () => {
        setIsOnline(false);
        console.log('📴 Sin conexión');
      }
    );

    // Estado inicial de la red
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      cleanupNetworkListeners();
    };
  }, []);

  // No mostrar nada si todo está OK
  if (swStatus === 'registered' && isOnline) {
    return null;
  }

  return (
    <>
      {/* Banner de estado offline */}
      {!isOnline && (
        <div
          className="fixed top-0 left-0 right-0 z-[9999] bg-yellow-500 text-white text-center py-2 px-4 shadow-lg"
          role="alert"
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
            <span className="font-medium">Sin conexión a Internet</span>
          </div>
          <p className="text-xs mt-1">
            Algunas funciones pueden estar limitadas
          </p>
        </div>
      )}

      {/* Mensaje de Service Worker no soportado */}
      {swStatus === 'unsupported' && (
        <div className="fixed bottom-4 right-4 z-50 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-bold text-sm">Funcionalidad limitada</p>
              <p className="text-xs mt-1">
                Tu navegador no soporta todas las características. Considera usar Chrome o Firefox.
              </p>
            </div>
            <button
              onClick={() => setSwStatus('loading')}
              className="text-orange-700 hover:text-orange-900"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Prompt de actualización */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-primary-600 text-white p-4 rounded-lg shadow-xl max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <div className="flex-1">
              <p className="font-bold">Nueva versión disponible</p>
              <p className="text-sm mt-1">
                Hay una actualización de FoodLink lista para instalar.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-white text-primary-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Actualizar ahora
            </button>
            <button
              onClick={() => setShowUpdatePrompt(false)}
              className="px-4 py-2 border border-white rounded-md hover:bg-primary-700 transition"
            >
              Más tarde
            </button>
          </div>
        </div>
      )}
    </>
  );
}

