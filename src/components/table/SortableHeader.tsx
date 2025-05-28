import { UnfoldMore, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

export type SortField = 'ordem' | 'nome' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

interface SortableHeaderProps {
    label: string;
    sortKey: SortField;
    currentSortBy: SortField;
    currentSortOrder: SortOrder;
    onSort: (sortBy: SortField, sortOrder: SortOrder) => void;
    className?: string;
}

export default function SortableHeader({
    label,
    sortKey,
    currentSortBy,
    currentSortOrder,
    onSort,
    className = '',
}: SortableHeaderProps) {
    const isActive = currentSortBy === sortKey;
    const isAsc = currentSortOrder === 'asc';

    const handleClick = () => {
        if (isActive) {
            onSort(sortKey, isAsc ? 'desc' : 'asc');
        } else {
            onSort(sortKey, 'asc');
        }
    };

    return (
        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
            <button
                onClick={handleClick}
                className={`flex items-center gap-1 hover:text-gray-700 transition-colors duration-200 group ${
                    isActive ? 'text-gray-700' : ''
                }`}
            >
                <span>{label}</span>
                <div className="flex flex-col">
                    {isActive ? (
                        isAsc ? (
                            <KeyboardArrowUp className="w-4 h-4 text-blue-600" />
                        ) : (
                            <KeyboardArrowDown className="w-4 h-4 text-blue-600" />
                        )
                    ) : (
                        <UnfoldMore className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                    )}
                </div>
            </button>
        </th>
    );
}
