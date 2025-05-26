import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterList } from '@mui/icons-material';

// Components
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import InputSearch from '@/components/ui/InputSearch';
import PiecesTable from '@/components/PiecesTable';

// Types
import { Piece } from '@/types/pieces';

// Services
import { recortesService } from '@/services/recortes';

export default function Dashboard() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Função para carregar as peças
    const loadPieces = async () => {
        setIsLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
                limit: 10,
                sortBy: 'ordem',
                sortOrder: 'asc' as const,
                ...(searchTerm.trim() && { search: searchTerm.trim() }),
            };

            const response = await recortesService.getRecortes(params);

            setPieces(response.pieces);
            setTotalPages(response.totalPages);
            setTotal(response.total);
        } catch (err) {
            console.error('Erro ao carregar peças:', err);
            setError('Erro ao carregar peças. Tente novamente.');
            setPieces([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Carregar peças quando a página ou filtros mudarem
    useEffect(() => {
        loadPieces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchTerm]);

    // Função para recarregar após exclusão
    const handleDeleteSuccess = () => {
        loadPieces();
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setCurrentPage(1); // Reset para primeira página ao mudar filtro
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset para primeira página ao pesquisar
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Filtrar peças por status no frontend (já que a API não tem esse campo)
    const filteredPieces = pieces.filter((piece) => {
        if (activeFilter === 'todos') return true;
        if (activeFilter === 'ativos') return piece.status === 'Ativo';
        if (activeFilter === 'expirado') return piece.status === 'Expirado';
        return true;
    });

    // Contar peças por status
    const counts = {
        todos: pieces.length,
        ativos: pieces.filter((p) => p.status === 'Ativo').length,
        expirado: pieces.filter((p) => p.status === 'Expirado').length,
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
                            <Button variant="primary" className="w-full lg:w-auto" onClick={() => navigate('/criar')}>
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
                                    Todos ({counts.todos})
                                </button>
                                <button
                                    onClick={() => handleFilterChange('ativos')}
                                    className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                                        activeFilter === 'ativos'
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Ativos ({counts.ativos})
                                </button>
                                <button
                                    onClick={() => handleFilterChange('expirado')}
                                    className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                                        activeFilter === 'expirado'
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Inativos ({counts.expirado})
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

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-800 text-sm">{error}</p>
                                <Button variant="secondary" onClick={loadPieces} className="mt-2">
                                    Tentar novamente
                                </Button>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Carregando peças...</p>
                                </div>
                            </div>
                        )}

                        {/* Table Container */}
                        {!isLoading && !error && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {filteredPieces.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-gray-600 mb-4">
                                            {searchTerm
                                                ? 'Nenhuma peça encontrada para sua busca.'
                                                : 'Nenhuma peça cadastrada.'}
                                        </p>
                                        <Button variant="primary" onClick={() => navigate('/criar')}>
                                            Adicionar primeira peça
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <PiecesTable
                                            pieces={filteredPieces}
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                            onDeleteSuccess={handleDeleteSuccess}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Espaçamento extra para mobile */}
                        <div className="h-20 lg:h-8"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}
