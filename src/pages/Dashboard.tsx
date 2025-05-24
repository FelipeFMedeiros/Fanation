import { useState } from 'react';
import { FilterList } from '@mui/icons-material';

// Components
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import InputSearch from '@/components/ui/InputSearch';
import PiecesTable from '@/components/PiecesTable';

// Utilities
import { mockPieces } from '@/utils/mockPieces';

export default function Dashboard() {
    const [activeFilter, setActiveFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <Header variant="primary" />

            {/* Main Container */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-8 pt-16 lg:pt-8">
                        {/* Page Header */}
                        <div className="flex flex-col gap-4 mb-6 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Peças gerais</h1>
                            <Button variant="primary" className="w-full lg:w-auto">
                                Adicionar peça
                            </Button>
                        </div>

                        {/* Filter Tabs */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto pb-2 scrollbar-none">
                                <button
                                    onClick={() => handleFilterChange('todos')}
                                    className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                                        activeFilter === 'todos'
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Todos (000)
                                </button>
                                <button
                                    onClick={() => handleFilterChange('ativos')}
                                    className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                                        activeFilter === 'ativos'
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Ativos (0)
                                </button>
                                <button
                                    onClick={() => handleFilterChange('expirado')}
                                    className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                                        activeFilter === 'expirado'
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Expirado (0)
                                </button>
                            </div>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="flex gap-3 mb-4 lg:mb-6">
                            <div className="flex-1 min-w-0">
                                <InputSearch
                                    placeholder="Pesquisar peças..."
                                    onSearch={handleSearch}
                                    value={searchTerm}
                                />
                            </div>
                            <Button
                                variant="secondary"
                                className="flex items-center justify-center gap-2 px-3 py-2 flex-shrink-0"
                            >
                                <FilterList className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <PiecesTable
                                    pieces={mockPieces}
                                    currentPage={currentPage}
                                    totalPages={4}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>

                        {/* Espaçamento extra para mobile */}
                        <div className="h-20 lg:h-8"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}
