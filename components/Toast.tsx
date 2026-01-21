
import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-4 duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[200px] border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' :
            toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
            'bg-gray-900/90 border-gray-800 text-white'
          }`}>
            {toast.type === 'success' && <CheckCircle size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span className="text-sm font-bold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-auto opacity-50"><X size={14} /></button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
