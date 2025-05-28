// Components
import SortableHeader, { SortField, SortOrder } from './table/SortableHeader';
import TablePagination from './table/TablePagination';
import PieceItemDisplay from './table/PieceItemDisplay';
import StatusBadge from './table/StatusBadge';
import DisplayOrderIndicator from './table/DisplayOrderIndicator';
// Types
import { Piece } from '@/types/pieces';

interface SelectablePiecesTableProps {
    pieces: Piece[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    sortBy: SortField;
    sortOrder: SortOrder;
    onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void;
    selectedPieces: string[];
    onSelectPiece: (sku: string) => void;
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
    const handleRowClick = (sku: string) => {
        onSelectPiece(sku);
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
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
                                    className={`
                                        ${
                                            isSelected
                                                ? 'bg-blue-100 border-y border-blue-200'
                                                : index % 2 === 0
                                                ? 'bg-white'
                                                : 'bg-gray-100'
                                        }
                                        transition-all duration-200 
                                        hover:bg-blue-50 hover:shadow-sm
                                        cursor-pointer
                                        group
                                `}
                                    onClick={() => handleRowClick(piece.sku)}
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => onSelectPiece(piece.sku)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <PieceItemDisplay piece={piece} />
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
                                        <DisplayOrderIndicator displayOrder={piece.displayOrder} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={piece.status} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    );
}
