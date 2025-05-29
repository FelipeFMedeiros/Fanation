import { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastType } from '@/components/ui/Toast';

interface ToastItem {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
    showSuccess: (title: string, message?: string) => void;
    showError: (title: string, message?: string) => void;
    showWarning: (title: string, message?: string) => void;
    showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const showToast = (type: ToastType, title: string, message?: string, duration = 5000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastItem = { id, type, title, message, duration };

        setToasts((prev) => {
            // Limitar a 5 toasts máximo
            const updatedToasts = [...prev, newToast];
            return updatedToasts.slice(-5);
        });
    };

    const showSuccess = (title: string, message?: string) => {
        showToast('success', title, message);
    };

    const showError = (title: string, message?: string) => {
        showToast('error', title, message);
    };

    const showWarning = (title: string, message?: string) => {
        showToast('warning', title, message);
    };

    const showInfo = (title: string, message?: string) => {
        showToast('info', title, message);
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
            {children}

            {/* Toast Container */}
            <div
                className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
                style={{
                    maxHeight: 'calc(100vh - 2rem)',
                    overflow: 'hidden',
                }}
            >
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            id={toast.id}
                            type={toast.type}
                            title={toast.title}
                            message={toast.message}
                            duration={toast.duration}
                            onClose={removeToast}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
