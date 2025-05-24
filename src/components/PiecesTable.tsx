import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface Piece {
    id: string;
    title: string;
    sku: string;
    type: string;
    displayOrder: number;
    status: 'Ativo' | 'Inativo' | 'Expirado';
}

interface PiecesTableProps {
    pieces: Piece[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export default function PiecesTable({ pieces, currentPage = 1, totalPages = 4, onPageChange }: PiecesTableProps) {
    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap';

        switch (status) {
            case 'Ativo':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'Inativo':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            case 'Expirado':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange?.(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange?.(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        onPageChange?.(page);
    };

    // Função para renderizar páginas visíveis (mobile responsivo)
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = window.innerWidth < 640 ? 3 : Math.min(5, totalPages);

        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`
                        relative inline-flex items-center px-3 py-2 border text-sm font-medium
                        transition-colors duration-200 min-w-[40px] justify-center
                        ${
                            i === currentPage
                                ? 'z-10 bg-gray-900 border-gray-900 text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }
                    `}
                >
                    {i}
                </button>,
            );
        }

        return pages;
    };

    return (
        <div className="w-full">
            {/* Table - Garantir largura mínima para scroll horizontal */}
            <div className="min-w-[700px]">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                Título
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                SKU
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                Tipo
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                Ordem de exibição
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pieces.map((piece) => (
                            <tr key={piece.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-3 lg:px-6 py-4 text-sm font-medium text-gray-900">
                                    <div className="max-w-[180px] truncate" title={piece.title}>
                                        {piece.title}
                                    </div>
                                </td>
                                <td className="px-3 lg:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                    {piece.sku}
                                </td>
                                <td className="px-3 lg:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                    {piece.type}
                                </td>
                                <td className="px-3 lg:px-6 py-4 text-sm text-gray-900 whitespace-nowrap text-center">
                                    {piece.displayOrder}
                                </td>
                                <td className="px-3 lg:px-6 py-4">
                                    <span className={getStatusBadge(piece.status)}>{piece.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-3 lg:px-6 py-3 flex items-center justify-between border-t border-gray-200 min-w-[700px]">
                <div className="flex items-center justify-between w-full">
                    {/* Info de resultados - apenas desktop */}
                    <div className="hidden sm:flex sm:flex-1 sm:items-center">
                        <p className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> até{' '}
                            <span className="font-medium">{Math.min(currentPage * 10, pieces.length)}</span> de{' '}
                            <span className="font-medium">{pieces.length}</span> resultados
                        </p>
                    </div>

                    {/* Paginação */}
                    <div className="flex items-center justify-center flex-1 sm:justify-end">
                        <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                        >
                            {/* Previous Button */}
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <span className="sr-only">Anterior</span>
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {/* Page Numbers */}
                            {renderPageNumbers()}

                            {/* Next Button */}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <span className="sr-only">Próximo</span>
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
