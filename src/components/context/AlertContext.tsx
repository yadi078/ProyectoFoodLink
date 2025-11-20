/**
 * Contexto de Alertas
 * Manejo global de alertas en la aplicación
 */

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert, { AlertType } from '../ui/Alert';

interface AlertState {
  message: string;
  type: AlertType;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe usarse dentro de AlertProvider');
  }
  return context;
};

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = useCallback((message: string, type: AlertType = 'info') => {
    setAlert({ message, type });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          duration={5000}
          onClose={hideAlert}
        />
      )}
    </AlertContext.Provider>
  );
}

