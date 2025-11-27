'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  id: string;
  message: string;
  type: AlertType;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (message: string, type?: AlertType) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (message: string, type: AlertType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    const newAlert: Alert = { id, message, type };
    
    setAlerts((prev) => [...prev, newAlert]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </AlertContext.Provider>
  );
}

function AlertContainer({ 
  alerts, 
  removeAlert 
}: { 
  alerts: Alert[]; 
  removeAlert: (id: string) => void;
}) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <AlertComponent key={alert.id} alert={alert} onClose={() => removeAlert(alert.id)} />
      ))}
    </div>
  );
}

function AlertComponent({ 
  alert, 
  onClose 
}: { 
  alert: Alert; 
  onClose: () => void;
}) {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[alert.type];

  const textColor = 'text-white';

  return (
    <div
      className={`${bgColor} ${textColor} px-6 py-4 rounded-lg shadow-lg min-w-[300px] max-w-md alert-enter`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p className="font-medium">{alert.message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Cerrar alerta"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

