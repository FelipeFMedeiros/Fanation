import { ArrowUpward, ArrowDownward, Delete } from '@mui/icons-material';

// Types
import { Piece } from '@/types/pieces';

interface LayeredPiecesTableProps {
    pieces: Piece[];
    onMoveUp?: (index: number) => void;
    onMoveDown?: (index: number) => void;
    onRemovePiece?: (pieceId: string) => void;
}

export default function LayeredPiecesTable({ pieces, onMoveUp, onMoveDown, onRemovePiece }: LayeredPiecesTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Peça
                        </th>
                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                            Ordem
                        </th>
                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pieces.map((piece, index) => (
                        <tr key={piece.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-6 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        {piece.imageUrl ? (
                                            <img
                                                className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                                                src={piece.imageUrl}
                                                alt={piece.title}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                <span className="text-gray-400 text-xs font-medium">IMG</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">{piece.title}</div>
                                        <div className="text-xs text-gray-500">SKU: {piece.sku}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap text-center">
                                <div className="text-sm font-medium">{index + 1}</div>
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap">
                                <div className="flex items-center justify-center space-x-1">
                                    {onMoveUp && (
                                        <button
                                            onClick={() => onMoveUp(index)}
                                            disabled={index === 0}
                                            className={`p-1 rounded hover:bg-gray-100 ${
                                                index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500'
                                            }`}
                                            title="Mover para cima"
                                        >
                                            <ArrowUpward fontSize="small" />
                                        </button>
                                    )}

                                    {onMoveDown && (
                                        <button
                                            onClick={() => onMoveDown(index)}
                                            disabled={index === pieces.length - 1}
                                            className={`p-1 rounded hover:bg-gray-100 ${
                                                index === pieces.length - 1
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-500'
                                            }`}
                                            title="Mover para baixo"
                                        >
                                            <ArrowDownward fontSize="small" />
                                        </button>
                                    )}

                                    {onRemovePiece && (
                                        <button
                                            onClick={() => onRemovePiece(piece.id)}
                                            className="p-1 rounded text-red-500 hover:bg-red-50"
                                            title="Remover"
                                        >
                                            <Delete fontSize="small" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {pieces.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                Nenhuma peça selecionada
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
