import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast Context
const ToastContext = createContext(null);

// Toast types with their configurations
const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-void border-2 border-emerald-500/20',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    iconColor: 'text-emerald-400',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-void border-2 border-red/20',
    borderColor: 'border-red/40',
    textColor: 'text-red',
    iconColor: 'text-red',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-void border-2 border-gold/20',
    borderColor: 'border-gold/40',
    textColor: 'text-gold',
    iconColor: 'text-gold',
  },
  info: {
    icon: Info,
    bgColor: 'bg-void border-2 border-blue-400/20',
    borderColor: 'border-blue-400/40',
    textColor: 'text-blue-400',
    iconColor: 'text-blue-400',
  },
};

// Individual Toast Component
function ToastItem({ id, type, title, message, duration = 5000, onRemove }) {
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`w-full max-w-sm p-5 rounded-sm border-2 backdrop-blur-xl ${config.bgColor} ${config.borderColor} shadow-hard relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] rotate-45 -mr-8 -mt-8 pointer-events-none" />
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && <p className={`text-sm font-semibold ${config.textColor} mb-1`}>{title}</p>}
          <p className="text-sm text-text-secondary font-body leading-relaxed">{message}</p>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-text-tertiary hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Toast Container
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem {...toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Toast Provider
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, { title, message, duration }) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((data) => addToast('success', data), [addToast]);
  const error = useCallback((data) => addToast('error', data), [addToast]);
  const warning = useCallback((data) => addToast('warning', data), [addToast]);
  const info = useCallback((data) => addToast('info', data), [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Custom hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContainer;
