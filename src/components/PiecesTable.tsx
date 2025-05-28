import { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// Components
import SortableHeader, { SortField, SortOrder } from './table/SortableHeader';
import TablePagination from './table/TablePagination';
import PieceItemDisplay from './table/PieceItemDisplay';
import StatusBadge from './table/StatusBadge';
import DisplayOrderIndicator from './table/DisplayOrderIndicator';
import ConfirmationModal from './ui/ConfirmationModal';
// Types
import { Piece } from '@/types/pieces';
// Services
import { recortesService } from '@/services/recortes';

interface PiecesTableProps {
    pieces: Piece[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onDeleteSuccess?: () => void;
    sortBy: SortField;
    sortOrder: SortOrder;
    onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void;
}

export default function PiecesTable({
    pieces,
    currentPage,
    totalPages,
    onPageChange,
    onDeleteSuccess,
    sortBy,
    sortOrder,
    onSortChange,
}: PiecesTableProps) {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pieceToDelete, setPieceToDelete] = useState<{ id: string; title: string } | null>(null);

    const handleEdit = (sku: string) => {
        const cleanSku = sku.startsWith('#') ? sku.substring(1) : sku;
        navigate(`/editar/${encodeURIComponent(cleanSku)}`);
    };

    const handleDeleteClick = (id: string, title: string) => {
        setPieceToDelete({ id, title });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!pieceToDelete) return;

        setDeletingId(pieceToDelete.id);
        try {
            await recortesService.deleteRecorte(pieceToDelete.id);
            onDeleteSuccess?.();
            setShowDeleteModal(false);
            setPieceToDelete(null);
        } catch (error) {
            console.error('Erro ao excluir peça:', error);
            alert('Erro ao excluir peça. Tente novamente.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteCancel = () => {
        if (deletingId) return;
        setShowDeleteModal(false);
        setPieceToDelete(null);
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pieces.map((piece, index) => (
                            <tr
                                key={piece.id}
                                className={`
                                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                                    transition-all duration-200 
                                    hover:bg-blue-50 hover:shadow-sm
                                    group
                                `}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <PieceItemDisplay piece={piece} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded border">
                                        {piece.sku}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 capitalize">{piece.productType || '-'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <DisplayOrderIndicator displayOrder={piece.displayOrder} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={piece.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(piece.sku)}
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105 opacity-80 group-hover:opacity-100 hover:cursor-pointer"
                                            title="Editar peça"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(piece.id, piece.title)}
                                            disabled={deletingId === piece.id}
                                            className={`p-2 rounded-lg transition-all duration-200 opacity-80 group-hover:opacity-100 ${
                                                deletingId === piece.id
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-600 hover:text-red-900 hover:bg-red-50 hover:scale-105 hover:cursor-pointer'
                                            }`}
                                            title="Excluir peça"
                                        >
                                            {deletingId === piece.id ? (
                                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                            ) : (
                                                <Delete className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Excluir Peça"
                message={`Tem certeza que deseja excluir a peça "${pieceToDelete?.title}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                isLoading={!!deletingId}
                variant="danger"
            />
        </div>
    );
}
