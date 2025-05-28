interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Inativo':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'Expirado':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
            {status}
        </span>
    );
}
