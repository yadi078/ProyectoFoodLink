"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  type = "warning",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const iconColor = {
    danger: "text-red-600",
    warning: "text-[#FFA552]",
    info: "text-blue-600",
  }[type];

  const confirmButtonColor = {
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    warning:
      "bg-gradient-to-r from-[#FFA552] to-[#ff8c2e] hover:from-[#ff8c2e] hover:to-[#ff7300]",
    info: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
  }[type];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[10000] transition-opacity duration-300"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm z-[10001] animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="bg-[#faf8f5] border-2 border-[#FFA552] rounded-2xl shadow-2xl overflow-hidden">
          {/* Icono y Título */}
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 ${iconColor} flex items-center justify-center rounded-full bg-white border-2 border-current`}
              >
                {type === "danger" && (
                  <svg
                    className="w-8 h-8"
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
                )}
                {type === "warning" && (
                  <svg
                    className="w-8 h-8"
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
                )}
                {type === "info" && (
                  <svg
                    className="w-8 h-8"
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
                )}
              </div>
            </div>
            <h2
              id="confirm-dialog-title"
              className="text-xl font-bold text-gray-800 mb-3 font-display"
            >
              {title}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 p-4 bg-white bg-opacity-50">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-white hover:border-gray-400 transition-all duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-sm ${confirmButtonColor} text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
