/**
 * Componente de Depuración para Notificaciones
 * Solo para desarrollo - Ayuda a probar el sistema de permisos
 */

'use client';

import { useState, useEffect } from 'react';
import {
  getNotificationPermission,
  getNotificationSettings,
  type NotificationPermissionState,
} from '@/services/notifications/notificationService';

interface NotificationDebuggerProps {
  userId: string;
}

export default function NotificationDebugger({ userId }: NotificationDebuggerProps) {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>('default');
  const [settings, setSettings] = useState<any>(null);
  const [lastCheck, setLastCheck] = useState<string>('');

  useEffect(() => {
    const updateState = () => {
      const permission = getNotificationPermission();
      const userSettings = getNotificationSettings(userId);
      
      setPermissionState(permission);
      setSettings(userSettings);
      setLastCheck(new Date().toLocaleTimeString());
    };

    // Actualizar inmediatamente
    updateState();

    // Actualizar cada segundo para mostrar cambios en tiempo real
    const interval = setInterval(updateState, 1000);

    return () => clearInterval(interval);
  }, [userId]);

  if (process.env.NODE_ENV === 'production') {
    return null; // No mostrar en producción
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-sm z-50 text-xs font-mono">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">🐛 Debug Notificaciones</h3>
        <span className="text-gray-400">{lastCheck}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Estado Browser:</span>
          <span className={`font-bold ${
            permissionState === 'granted' ? 'text-green-400' :
            permissionState === 'denied' ? 'text-red-400' :
            'text-yellow-400'
          }`}>
            {permissionState}
          </span>
        </div>
        
        {settings && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">Activado App:</span>
              <span className={settings.enabled ? 'text-green-400' : 'text-red-400'}>
                {settings.enabled ? 'SÍ' : 'NO'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Rechazos:</span>
              <span className="text-yellow-400">
                {settings.permissionDeniedCount} / 3
              </span>
            </div>
            
            {settings.lastPermissionRequest && (
              <div className="flex justify-between">
                <span className="text-gray-400">Última solicitud:</span>
                <span className="text-blue-400">
                  {new Date(settings.lastPermissionRequest).toLocaleTimeString()}
                </span>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-gray-400 text-[10px] leading-tight">
          💡 Para probar: Activa/desactiva notificaciones desde los ajustes del navegador y observa los cambios.
        </p>
      </div>
    </div>
  );
}

