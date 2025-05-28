import { ChevronLeft, ChevronRight, UnfoldMore, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

// Components
import Button from './ui/Button';

// Types
import { Piece } from '@/types/pieces';

interface SelectablePiecesTableProps {
    pieces: Piece[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    sortBy: 'ordem' | 'nome' | 'createdAt';
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: 'ordem' | 'nome' | 'createdAt', sortOrder: 'asc' | 'desc') => void;
    selectedPieces: string[]; // Array of selected SKUs
    onSelectPiece: (sku: string) => void; // Function to handle selection
}

interface SortableHeaderProps {
    label: string;
    sortKey: 'ordem' | 'nome' | 'createdAt';
    currentSortBy: 'ordem' | 'nome' | 'createdAt';
    currentSortOrder: 'asc' | 'desc';
    onSort: (sortBy: 'ordem' | 'nome' | 'createdAt', sortOrder: 'asc' | 'desc') => void;
    className?: string;
}

function SortableHeader({
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
            // If already sorting by this column, reverse the order
            onSort(sortKey, isAsc ? 'desc' : 'asc');
        } else {
            // If new column, start with ascending
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

export default function SelectablePiecesTable({
    pieces,
    currentPage,
    totalPages,
    onPageChange,
    sortBy,
    sortOrder,
    onSortChange,
    selectedPieces,
    onSelectPiece,
}: SelectablePiecesTableProps) {
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

    const handleRowClick = (sku: string) => {
        onSelectPiece(sku);
    };

    return (
        <div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Selection Column */}
                            <th className="px-4 py-3 w-10"></th>

                            <SortableHeader
                                label="Peça"
                                sortKey="nome"
                                currentSortBy={sortBy}
                                currentSortOrder={sortOrder}
                                onSort={onSortChange}
                            />
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <SortableHeader
                                label="Ordem"
                                sortKey="ordem"
                                currentSortBy={sortBy}
                                currentSortOrder={sortOrder}
                                onSort={onSortChange}
                            />
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pieces.map((piece, index) => {
                            const isSelected = selectedPieces.includes(piece.sku);
                            return (
                                <tr
                                    key={piece.id}
                                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                                    } ${isSelected ? 'bg-blue-50' : ''} cursor-pointer`}
                                    onClick={() => handleRowClick(piece.sku)}
                                >
                                    {/* Selection column */}
                                    <td
                                        className="px-4 py-4"
                                        // Removido o onClick que fazia stopPropagation
                                    >
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => onSelectPiece(piece.sku)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                                onClick={e => e.stopPropagation()}
                                            />
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                {piece.imageUrl ? (
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                                        src={piece.imageUrl}
                                                        alt={piece.title}
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400 text-xs font-medium">IMG</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {piece.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <span className="capitalize">{piece.cutType}</span>
                                                    {piece.material && (
                                                        <>
                                                            <span className="mx-1">•</span>
                                                            <span className="capitalize">{piece.material}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded border">
                                            {piece.sku}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 capitalize">
                                            {piece.productType || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-900 font-medium">
                                                {piece.displayOrder}
                                            </span>
                                            <div className="w-8 h-2 bg-gray-200 rounded-full relative">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{
                                                        width: `${Math.min((piece.displayOrder / 10) * 100, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                                piece.status,
                                            )}`}
                                        >
                                            {piece.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Página <span className="font-medium">{currentPage}</span> de{' '}
                            <span className="font-medium">{totalPages}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-2 py-1 md:px-2 md:py-1 flex items-center gap-1 text-sm hover:cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Anterior</span>
                            </Button>

                            {/* Page numbers for desktop */}
                            <div className="hidden md:flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => onPageChange(pageNum)}
                                            className={`px-1.5 py-0.5 text-xs rounded transition-colors duration-200 hover:cursor-pointer ${
                                                currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                            style={{ minWidth: 24 }}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="secondary"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 md:px-2 md:py-1 flex items-center gap-1 text-sm hover:cursor-pointer"
                            >
                                <span className="hidden sm:inline">Próxima</span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
