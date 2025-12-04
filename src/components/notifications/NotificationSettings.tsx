/**
 * Componente de Configuración de Notificaciones
 * Permite al usuario gestionar sus preferencias de notificaciones
 */

'use client';

import { useState, useEffect } from 'react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  getNotificationSettings,
  saveNotificationSettings,
  updateNotificationPreference,
  isNotificationSupported,
  canRequestPermission,
  getPermissionMessage,
  sendTestNotification,
  startPermissionMonitoring,
  type NotificationPermissionState,
  type NotificationSettings as INotificationSettings,
} from '@/services/notifications/notificationService';

interface NotificationSettingsProps {
  userId: string;
}

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>('default');
  const [settings, setSettings] = useState<INotificationSettings | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Cargar configuración inicial
  useEffect(() => {
    const currentPermission = getNotificationPermission();
    setPermissionState(currentPermission);
    
    const userSettings = getNotificationSettings(userId);
    setSettings(userSettings);
  }, [userId]);

  // Monitorear cambios en permisos (detecta cambios desde el SO)
  useEffect(() => {
    console.log('🔍 Iniciando monitoreo de permisos de notificaciones');
    
    const cleanup = startPermissionMonitoring(userId, (newState) => {
      console.log('🔔 Cambio detectado en permisos:', newState);
      setPermissionState(newState);
      
      // Recargar settings si cambió el estado
      const userSettings = getNotificationSettings(userId);
      setSettings(userSettings);
      
      // Si el usuario desactivó desde el SO, ocultar instrucciones
      if (newState === 'denied') {
        console.log('⚠️ Usuario desactivó notificaciones desde el sistema operativo');
      }
    });

    return () => {
      console.log('🛑 Deteniendo monitoreo de permisos');
      cleanup();
    };
  }, [userId]);

  if (!isNotificationSupported()) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">
              Notificaciones no disponibles
            </h3>
            <p className="text-sm text-yellow-700">
              Tu navegador no soporta notificaciones push. Intenta usar Chrome, Firefox, Edge o Safari.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  const handleEnableNotifications = async () => {
    console.log('👆 Usuario intenta activar notificaciones');
    
    // Si ya está bloqueado permanentemente, mostrar instrucciones inmediatamente
    if (permissionState === 'denied') {
      console.log('🚫 Permisos ya bloqueados - Mostrando instrucciones');
      setShowInstructions(true);
      return;
    }
    
    // Si alcanzó el límite de rechazos, mostrar instrucciones
    if (!canRequestPermission(userId)) {
      console.log('⏰ Límite de rechazos alcanzado - Mostrando instrucciones');
      setShowInstructions(true);
      return;
    }

    setIsRequesting(true);
    setShowInstructions(false); // Ocultar instrucciones al intentar
    
    try {
      const result = await requestNotificationPermission(userId);
      console.log('✅ Resultado de solicitud de permisos:', result);
      setPermissionState(result);
      
      if (result === 'granted') {
        console.log('🎉 Permisos concedidos - Enviando notificación de prueba');
        // Enviar notificación de prueba
        await sendTestNotification();
        
        // Actualizar settings
        const updatedSettings = getNotificationSettings(userId);
        setSettings(updatedSettings);
        setShowInstructions(false);
      } else if (result === 'denied') {
        console.log('❌ Permisos denegados - Mostrando instrucciones');
        setShowInstructions(true);
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (!settings.enabled && permissionState !== 'granted') {
      // Necesita solicitar permisos
      await handleEnableNotifications();
    } else {
      // Solo cambiar configuración local
      const newSettings = {
        ...settings,
        enabled: !settings.enabled,
      };
      setSettings(newSettings);
      saveNotificationSettings(userId, newSettings);
    }
  };

  const handleTogglePreference = (
    preference: keyof INotificationSettings,
    value: boolean
  ) => {
    updateNotificationPreference(userId, preference, value);
    setSettings({
      ...settings,
      [preference]: value,
    });
  };

  const permissionMessage = getPermissionMessage(permissionState);

  return (
    <div className="space-y-6">
      {/* Estado de Permisos */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Notificaciones
              </h2>
              <p className="text-sm text-gray-600">
                Mantente informado sobre tus pedidos y novedades
              </p>
            </div>
          </div>
          
          {/* Toggle Principal */}
          <button
            onClick={handleToggleNotifications}
            disabled={isRequesting || permissionState === 'denied'}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${
                settings.enabled && permissionState === 'granted'
                  ? 'bg-primary-600'
                  : 'bg-gray-300'
              }
              ${
                isRequesting || permissionState === 'denied'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${
                  settings.enabled && permissionState === 'granted'
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }
              `}
            />
          </button>
        </div>

        {/* Mensaje de Estado */}
        <div
          className={`
            p-4 rounded-lg border
            ${
              permissionState === 'granted'
                ? 'bg-green-50 border-green-200'
                : permissionState === 'denied'
                ? 'bg-red-50 border-red-200'
                : 'bg-blue-50 border-blue-200'
            }
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">
              {permissionState === 'granted'
                ? '✅'
                : permissionState === 'denied'
                ? '🚫'
                : 'ℹ️'}
            </span>
            <div className="flex-1">
              <h3
                className={`
                  font-semibold mb-1
                  ${
                    permissionState === 'granted'
                      ? 'text-green-900'
                      : permissionState === 'denied'
                      ? 'text-red-900'
                      : 'text-blue-900'
                  }
                `}
              >
                {permissionMessage.title}
              </h3>
              <p
                className={`
                  text-sm
                  ${
                    permissionState === 'granted'
                      ? 'text-green-700'
                      : permissionState === 'denied'
                      ? 'text-red-700'
                      : 'text-blue-700'
                  }
                `}
              >
                {permissionMessage.message}
              </p>
              
              {/* Botón de acción si aplica */}
              {permissionMessage.canRetry && permissionState !== 'granted' && (
                <button
                  onClick={handleEnableNotifications}
                  disabled={isRequesting}
                  className="mt-3 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isRequesting ? 'Solicitando...' : 'Activar notificaciones'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Instrucciones para activar desde el sistema */}
        {showInstructions && permissionState === 'denied' && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              📱 Cómo activar las notificaciones:
            </h4>
            <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
              <li>
                Haz clic en el <strong>icono de candado</strong> o <strong>información</strong> en la barra de direcciones
              </li>
              <li>
                Busca la sección de <strong>Permisos</strong> o <strong>Configuración del sitio</strong>
              </li>
              <li>
                Cambia <strong>Notificaciones</strong> de "Bloqueado" a "Permitir"
              </li>
              <li>Recarga la página</li>
            </ol>
            
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Entendido
            </button>
          </div>
        )}
      </div>

      {/* Preferencias de Notificaciones */}
      {settings.enabled && permissionState === 'granted' && (
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">
              Preferencias de notificaciones
            </h3>
          </div>
          
          <div className="space-y-4">
            <PreferenceToggle
              label="Pedidos nuevos"
              description="Cuando un estudiante realiza un pedido"
              checked={settings.pedidosNuevos}
              onChange={(checked) =>
                handleTogglePreference('pedidosNuevos', checked)
              }
            />
            
            <PreferenceToggle
              label="Actualizaciones de pedidos"
              description="Cambios en el estado de tus pedidos"
              checked={settings.actualizacionesPedidos}
              onChange={(checked) =>
                handleTogglePreference('actualizacionesPedidos', checked)
              }
            />
            
            <PreferenceToggle
              label="Mensajes de vendedores"
              description="Cuando un vendedor te envía un mensaje"
              checked={settings.mensajesVendedor}
              onChange={(checked) =>
                handleTogglePreference('mensajesVendedor', checked)
              }
            />
            
            <PreferenceToggle
              label="Promociones y ofertas"
              description="Ofertas especiales y descuentos"
              checked={settings.promociones}
              onChange={(checked) =>
                handleTogglePreference('promociones', checked)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface PreferenceToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200">
      <div className="flex-1">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${checked ? 'bg-primary-500 shadow-soft' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}

