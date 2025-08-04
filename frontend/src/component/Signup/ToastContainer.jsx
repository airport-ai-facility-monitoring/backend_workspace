import React, { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 3000) => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 1000,
          maxWidth: 300,
        }}
      >
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              background: type === "error" ? "#b00020" : "#333",
              color: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              fontSize: 14,
              opacity: 0.95,
            }}
          >
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.showToast;
};