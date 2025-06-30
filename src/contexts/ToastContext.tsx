'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface ToastMessage {
  id: string;
  message: string;
  severity: AlertColor;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, severity: AlertColor = 'info', duration: number = 6000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = { id, message, severity, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const showSuccess = (message: string, duration: number = 4000) => {
    showToast(message, 'success', duration);
  };

  const showError = (message: string, duration: number = 6000) => {
    showToast(message, 'error', duration);
  };

  const showWarning = (message: string, duration: number = 5000) => {
    showToast(message, 'warning', duration);
  };

  const showInfo = (message: string, duration: number = 4000) => {
    showToast(message, 'info', duration);
  };

  const handleClose = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      
      {/* Render all toasts */}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            mt: index * 7, // Stack toasts vertically
            position: 'fixed',
            zIndex: 9999
          }}
        >
          <Alert
            severity={toast.severity}
            onClose={() => handleClose(toast.id)}
            variant="filled"
            sx={{
              minWidth: '300px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '& .MuiAlert-message': {
                fontSize: '0.875rem',
                fontWeight: 500
              }
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};