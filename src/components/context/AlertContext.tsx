"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AlertType = "success" | "error" | "warning" | "info";

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

  const showAlert = (message: string, type: AlertType = "info") => {
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
  removeAlert,
}: {
  alerts: Alert[];
  removeAlert: (id: string) => void;
}) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <AlertComponent
          key={alert.id}
          alert={alert}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
}

function AlertComponent({
  alert,
  onClose,
}: {
  alert: Alert;
  onClose: () => void;
}) {
  const iconColor = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  }[alert.type];

  const icon = {
    success: (
      <svg
        className={`w-6 h-6 ${iconColor}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    error: (
      <svg
        className={`w-6 h-6 ${iconColor}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className={`w-6 h-6 ${iconColor}`}
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
    ),
    info: (
      <svg
        className={`w-6 h-6 ${iconColor}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  }[alert.type];

  return (
    <div
      className="bg-[#faf8f5] border-2 border-[#FFA552] px-4 py-3 rounded-xl shadow-lg min-w-[300px] max-w-md alert-enter"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <p className="flex-1 text-sm font-medium text-gray-800 leading-relaxed">
          {alert.message}
        </p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          aria-label="Cerrar alerta"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
