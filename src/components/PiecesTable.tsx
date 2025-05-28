import { useState } from 'react';
import {
    Edit,
    Delete,
    ChevronLeft,
    ChevronRight,
    UnfoldMore,
    KeyboardArrowUp,
    KeyboardArrowDown,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Components
import Button from './ui/Button';
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
    sortBy: 'ordem' | 'nome' | 'createdAt';
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: 'ordem' | 'nome' | 'createdAt', sortOrder: 'asc' | 'desc') => void;
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
            // Se já está ordenando por esta coluna, inverte a ordem
            onSort(sortKey, isAsc ? 'desc' : 'asc');
        } else {
            // Se é uma nova coluna, começa com 'asc'
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
        console.log('Editando peça com SKU original:', sku);

        // Garantir que o SKU está limpo (sem #)
        const cleanSku = sku.startsWith('#') ? sku.substring(1) : sku;
        console.log('SKU limpo para navegação:', cleanSku);

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
        if (deletingId) return; // Não permitir cancelar durante exclusão
        setShowDeleteModal(false);
        setPieceToDelete(null);
    };

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
        <div>
            {/* Tabela */}
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
                                className={`hover:bg-gray-50 transition-colors duration-150 ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                                }`}
                            >
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
                                    <div className="text-sm text-gray-900 capitalize">{piece.productType || '-'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 font-medium">{piece.displayOrder}</span>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(piece.sku)}
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                                            title="Editar peça"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(piece.id, piece.title)}
                                            disabled={deletingId === piece.id}
                                            className={`p-2 rounded-lg transition-all duration-200 ${
                                                deletingId === piece.id
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-600 hover:text-red-900 hover:bg-red-50 hover:scale-105'
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
                
                {/* Paginação */}
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

                            {/* Números das páginas para desktop */}
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

            {/* Modal de Confirmação */}
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
