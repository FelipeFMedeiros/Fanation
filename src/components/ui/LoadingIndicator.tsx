interface LoadingIndicatorProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    container?: boolean;
}

export default function LoadingIndicator({
    message = 'Carregando...',
    size = 'md',
    container = true,
}: LoadingIndicatorProps) {
    const spinnerSize = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
    }[size];

    const content = (
        <div className="flex flex-col items-center justify-center">
            <div className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-gray-900 mb-4`}></div>
            {message && <p className="text-gray-600">{message}</p>}
        </div>
    );

    if (!container) return content;

    return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">{content}</div>;
}
