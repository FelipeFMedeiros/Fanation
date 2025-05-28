import { Delete } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// Components
import PieceItemDisplay from './table/PieceItemDisplay';
// Types
import { Piece } from '@/types/pieces';

interface LayeredPiecesTableProps {
    pieces: Piece[];
    onReorder: (fromIndex: number, toIndex: number) => void;
    onRemovePiece?: (pieceId: string) => void;
}

// Componente para uma linha da tabela arrastável
const DraggableRow = ({
    piece,
    index,
    moveRow,
    onRemove,
}: {
    piece: Piece;
    index: number;
    moveRow: (fromIndex: number, toIndex: number) => void;
    onRemove?: (pieceId: string) => void;
}) => {
    const [{ isDragging }, dragRef] = useDrag({
        type: 'ROW',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver, canDrop }, dropRef] = useDrop({
        accept: 'ROW',
        drop: (draggedItem: { index: number }) => {
            if (draggedItem.index !== index) {
                moveRow(draggedItem.index, index);
            }
        },
        canDrop: (item) => item.index !== index,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    // Combina os refs de arrastar e soltar
    const ref = (el: HTMLTableRowElement) => {
        dragRef(el);
        dropRef(el);
    };

    const isActive = isOver && canDrop;

    return (
        <tr
            ref={ref}
            className={`
                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                ${isDragging ? 'opacity-50' : 'opacity-100'}
                ${isActive ? 'border-t-2 border-b-2 border-blue-500 bg-blue-50' : ''}
                transition-all duration-200 
                hover:bg-blue-50 hover:shadow-sm 
                cursor-grab active:cursor-grabbing
                group
            `}
        >
            <td className="px-6 py-3 whitespace-nowrap">
                <PieceItemDisplay piece={piece} compact={true} />
            </td>
            <td className="px-2 py-3 whitespace-nowrap text-center">
                <div className="text-sm font-medium transition-colors duration-200 group-hover:text-blue-700 group-hover:font-semibold">
                    {index + 1}
                </div>
            </td>
            <td className="px-2 py-3 whitespace-nowrap">
                <div className="flex items-center justify-center">
                    {onRemove && (
                        <button
                            onClick={() => onRemove(piece.id)}
                            className="p-1.5 rounded-full text-red-400 hover:text-red-700 hover:bg-red-50 
                                      transition-all duration-200 opacity-70 group-hover:opacity-100
                                      hover:shadow-sm"
                            title="Remover"
                        >
                            <Delete
                                fontSize="small"
                                className="transform hover:scale-110 transition-transform duration-150 hover:cursor-pointer"
                            />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

const DropPlaceholder = ({
    index,
    moveRow,
}: {
    index: number;
    moveRow: (fromIndex: number, toIndex: number) => void;
}) => {
    const [{ isOver, canDrop }, dropRef] = useDrop({
        accept: 'ROW',
        drop: (draggedItem: { index: number }) => {
            moveRow(draggedItem.index, index);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    return (
        <tr
            ref={dropRef}
            className={`h-16 ${isOver && canDrop ? 'bg-blue-50 shadow-inner' : 'bg-white'} 
                         transition-all duration-200`}
        >
            <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                {isOver && canDrop ? (
                    <div className="text-blue-600 font-medium animate-pulse">Solte aqui</div>
                ) : (
                    'Nenhuma peça selecionada. Arraste peças aqui.'
                )}
            </td>
        </tr>
    );
};

export default function LayeredPiecesTable({ pieces, onReorder, onRemovePiece }: LayeredPiecesTableProps) {
    const handleMoveRow = (fromIndex: number, toIndex: number) => {
        onReorder(fromIndex, toIndex);
    };

    return (
        <DndProvider backend={HTML5Backend}>
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
                        {pieces.length > 0 ? (
                            pieces.map((piece, index) => (
                                <DraggableRow
                                    key={piece.id}
                                    piece={piece}
                                    index={index}
                                    moveRow={handleMoveRow}
                                    onRemove={onRemovePiece}
                                />
                            ))
                        ) : (
                            <DropPlaceholder index={0} moveRow={handleMoveRow} />
                        )}
                    </tbody>
                </table>
            </div>
        </DndProvider>
    );
}
