/**
 * Componente de Alertas
 * Alertas con duración de 5 segundos para que el usuario las pueda leer
 */

'use client';

import { useEffect, useState } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  message: string;
  type?: AlertType;
  duration?: number;
  onClose?: () => void;
}

export default function Alert({ message, type = 'info', duration = 5000, onClose }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 300); // Tiempo de animación de salida
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800',
  };

  const iconStyles = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border-2 min-w-[300px] max-w-[500px] ${
        alertStyles[type]
      } ${isExiting ? 'alert-exit' : 'alert-enter'}`}
      role="alert"
    >
      <span className="text-2xl font-bold">{iconStyles[type]}</span>
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose?.();
          }, 300);
        }}
        className="text-xl font-bold opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Cerrar alerta"
      >
        ×
      </button>
    </div>
  );
}

