import { useEffect, useState } from 'react';
import { CheckCircle, Error, Warning, Info, Close } from '@mui/icons-material';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Animação de entrada
        setTimeout(() => setIsVisible(true), 10);

        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(id);
        }, 300); // Tempo da animação de saída
    };

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    icon: <CheckCircle className="w-5 h-5 text-green-400" />,
                    titleColor: 'text-green-800',
                    messageColor: 'text-green-700',
                    buttonHover: 'hover:text-green-900',
                };
            case 'error':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: <Error className="w-5 h-5 text-red-400" />,
                    titleColor: 'text-red-800',
                    messageColor: 'text-red-700',
                    buttonHover: 'hover:text-red-900',
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    icon: <Warning className="w-5 h-5 text-yellow-400" />,
                    titleColor: 'text-yellow-800',
                    messageColor: 'text-yellow-700',
                    buttonHover: 'hover:text-yellow-900',
                };
            case 'info':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    icon: <Info className="w-5 h-5 text-blue-400" />,
                    titleColor: 'text-blue-800',
                    messageColor: 'text-blue-700',
                    buttonHover: 'hover:text-blue-900',
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            className={`
                w-80 max-w-sm ${styles.bg} ${styles.border} border rounded-lg shadow-lg
                transform transition-all duration-300 ease-in-out
                ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                ${isLeaving ? 'translate-x-full opacity-0' : ''}
            `}
            style={{
                minWidth: '320px',
                maxWidth: '400px',
            }}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">{styles.icon}</div>
                    <div className="ml-3 flex-1 min-w-0">
                        <p className={`text-sm font-medium ${styles.titleColor} break-words`}>{title}</p>
                        {message && <p className={`mt-1 text-sm ${styles.messageColor} break-words`}>{message}</p>}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            className={`
                                rounded-md inline-flex ${styles.titleColor} ${styles.buttonHover}
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                                transition-colors duration-200
                            `}
                            onClick={handleClose}
                            aria-label="Fechar notificação"
                        >
                            <Close className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
