import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast debe usarse dentro de un ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: toast.type || 'info',
            title: toast.title,
            message: toast.message,
            duration: toast.duration || 5000,
        };

        setToasts((prev) => [...prev, newToast]);

        // Auto-remove toast
        setTimeout(() => {
            removeToast(id);
        }, newToast.duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((title, message) => {
        return addToast({ type: 'success', title, message });
    }, [addToast]);

    const error = useCallback((title, message) => {
        return addToast({ type: 'error', title, message });
    }, [addToast]);

    const warning = useCallback((title, message) => {
        return addToast({ type: 'warning', title, message });
    }, [addToast]);

    const info = useCallback((title, message) => {
        return addToast({ type: 'info', title, message });
    }, [addToast]);

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
        </ToastContext.Provider>
    );
};

export default ToastContext;
