import { useState, useCallback } from 'react';
import { ToastType } from '@/components/ui/Toast';

interface ToastData {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback(
        (title: string, message?: string, duration?: number) => {
            return addToast({ type: 'success', title, message, duration });
        },
        [addToast],
    );

    const error = useCallback(
        (title: string, message?: string, duration?: number) => {
            return addToast({ type: 'error', title, message, duration });
        },
        [addToast],
    );

    const warning = useCallback(
        (title: string, message?: string, duration?: number) => {
            return addToast({ type: 'warning', title, message, duration });
        },
        [addToast],
    );

    const info = useCallback(
        (title: string, message?: string, duration?: number) => {
            return addToast({ type: 'info', title, message, duration });
        },
        [addToast],
    );

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };
}
