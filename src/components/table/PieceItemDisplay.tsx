import { Piece } from '@/types/pieces';

interface PieceItemDisplayProps {
    piece: Piece;
    showDetails?: boolean;
    compact?: boolean;
}

export default function PieceItemDisplay({ piece, showDetails = true, compact = false }: PieceItemDisplayProps) {
    const imageSize = compact ? 'h-10 w-10' : 'h-12 w-12';

    return (
        <div className="flex items-center">
            <div className={`flex-shrink-0 ${imageSize} ${compact ? 'mr-3' : ''}`}>
                {piece.imageUrl ? (
                    <img
                        className={`${imageSize} rounded-lg object-cover border border-gray-200`}
                        src={piece.imageUrl}
                        alt={piece.title}
                    />
                ) : (
                    <div
                        className={`${imageSize} bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200`}
                    >
                        <span className="text-gray-400 text-xs font-medium">IMG</span>
                    </div>
                )}
            </div>
            <div className={compact ? '' : 'ml-4'}>
                <div className="text-sm font-medium text-gray-900 line-clamp-1">{piece.title}</div>
                {showDetails && (
                    <div className="text-xs text-gray-500">
                        {compact ? (
                            <>SKU: {piece.sku}</>
                        ) : (
                            <>
                                <span className="capitalize">{piece.cutType}</span>
                                {piece.material && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <span className="capitalize">{piece.material}</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
