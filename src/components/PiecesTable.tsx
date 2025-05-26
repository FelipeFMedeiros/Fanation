import { useState } from 'react';
import { Edit, Delete, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Components
import Button from './ui/Button';

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
}

export default function PiecesTable({
    pieces,
    currentPage,
    totalPages,
    onPageChange,
    onDeleteSuccess,
}: PiecesTableProps) {
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleEdit = (sku: string) => {
        console.log('Editando peça com SKU original:', sku);
        
        // Garantir que o SKU está limpo (sem #)
        const cleanSku = sku.startsWith('#') ? sku.substring(1) : sku;
        console.log('SKU limpo para navegação:', cleanSku);
        
        navigate(`/editar/${encodeURIComponent(cleanSku)}`);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) {
            return;
        }

        setDeletingId(id);
        try {
            await recortesService.deleteRecorte(id);
            onDeleteSuccess?.();
        } catch (error) {
            console.error('Erro ao excluir peça:', error);
            alert('Erro ao excluir peça. Tente novamente.');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (date?: Date) => {
        if (!date) return '-';
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo':
                return 'bg-green-100 text-green-800';
            case 'Inativo':
                return 'bg-gray-100 text-gray-800';
            case 'Expirado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Peça
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ordem
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Criado em
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pieces.map((piece) => (
                            <tr key={piece.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {piece.imageUrl ? (
                                                <img
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                    src={piece.imageUrl}
                                                    alt={piece.title}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">IMG</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{piece.title}</div>
                                            <div className="text-sm text-gray-500">
                                                {piece.cutType} • {piece.material}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 font-mono">{piece.sku}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {piece.productType
                                            ? piece.productType.charAt(0).toUpperCase() + piece.productType.slice(1)
                                            : ''}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                            piece.status,
                                        )}`}
                                    >
                                        {piece.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {piece.displayOrder}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(piece.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(piece.sku)}
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(piece.id, piece.title)}
                                            disabled={deletingId === piece.id}
                                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                                deletingId === piece.id
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                            }`}
                                            title="Excluir"
                                        >
                                            <Delete className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Página {currentPage} de {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
