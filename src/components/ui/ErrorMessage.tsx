import Button from '@/components/ui/Button';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    actionText?: string;
    actionCallback?: () => void;
}

export default function ErrorMessage({
    message,
    onRetry,
    actionText = 'Tentar novamente',
    actionCallback,
}: ErrorMessageProps) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{message}</p>
            {(onRetry || actionCallback) && (
                <Button variant="secondary" onClick={onRetry || actionCallback} className="mt-2">
                    {actionText}
                </Button>
            )}
        </div>
    );
}
