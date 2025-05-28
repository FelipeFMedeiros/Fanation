import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Button from '@/components/ui/Button';

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function TablePagination({ currentPage, totalPages, onPageChange }: TablePaginationProps) {
    return (
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
    );
}
