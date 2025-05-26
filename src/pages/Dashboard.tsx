import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterList } from '@mui/icons-material';

// Components
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import InputSearch from '@/components/ui/InputSearch';
import PiecesTable from '@/components/PiecesTable';
import FilterDropdown from '@/components/FilterDropdown';

// Types
import { Piece } from '@/types/pieces';

// Services
import { recortesService } from '@/services/recortes';

export default function Dashboard() {
    const navigate = useNavigate();
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    const [activeFilter, setActiveFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [sortBy, setSortBy] = useState<'ordem' | 'nome' | 'createdAt'>('ordem');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState({
        tipoRecorte: '',
        tipoProduto: '',
        material: '',
        cor: '',
    });

    // Estados para armazenar contagens (considerando filtros e pesquisa)
    const [globalCounts, setGlobalCounts] = useState({
        todos: 0,
        ativos: 0,
        inativos: 0,
    });
    const [isLoadingCounts, setIsLoadingCounts] = useState(false);

    // Função para carregar contagens considerando filtros e pesquisa
    const loadFilteredCounts = async () => {
        setIsLoadingCounts(true);
        try {
            // Parâmetros base (filtros e pesquisa, mas sem o status)
            const baseParams = {
                page: 1,
                limit: 1, // Só precisamos do total
                ...(searchTerm.trim() && { search: searchTerm.trim() }),
                ...(filters.tipoRecorte && { tipoRecorte: filters.tipoRecorte }),
                ...(filters.tipoProduto && { tipoProduto: filters.tipoProduto }),
                ...(filters.material && { material: filters.material }),
                ...(filters.cor && { cor: filters.cor }),
            };

            // Buscar contagens com os filtros aplicados
            const [todosResponse, ativosResponse, inativosResponse] = await Promise.all([
                recortesService.getRecortes(baseParams), // Todos
                recortesService.getRecortes({ ...baseParams, status: true }), // Ativos
                recortesService.getRecortes({ ...baseParams, status: false }), // Inativos
            ]);

            setGlobalCounts({
                todos: todosResponse.total,
                ativos: ativosResponse.total,
                inativos: inativosResponse.total,
            });
        } catch (err) {
            console.error('Erro ao carregar contagens:', err);
            // Manter contagens anteriores em caso de erro
        } finally {
            setIsLoadingCounts(false);
        }
    };

    // Função para carregar as peças
    const loadPieces = async () => {
        setIsLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
                limit: 10,
                sortBy,
                sortOrder,
                ...(searchTerm.trim() && { search: searchTerm.trim() }),
                ...(activeFilter === 'ativos' && { status: true }),
                ...(activeFilter === 'inativos' && { status: false }),
                ...(filters.tipoRecorte && { tipoRecorte: filters.tipoRecorte }),
                ...(filters.tipoProduto && { tipoProduto: filters.tipoProduto }),
                ...(filters.material && { material: filters.material }),
                ...(filters.cor && { cor: filters.cor }),
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

    // Carregar contagens quando filtros ou pesquisa mudarem
    useEffect(() => {
        loadFilteredCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, filters]);

    // Carregar peças quando a página ou filtros mudarem
    useEffect(() => {
        loadPieces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchTerm, activeFilter, sortBy, sortOrder, filters]);

    // Função para recarregar após exclusão
    const handleDeleteSuccess = () => {
        loadPieces();
        loadFilteredCounts(); // Recarregar contagens também
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

    const handleSortChange = (newSortBy: 'ordem' | 'nome' | 'createdAt', newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1);
    };

    const handleFilterApply = (newFilters: typeof filters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        setShowFilterDropdown(false);
    };

    const handleFilterReset = () => {
        setFilters({
            tipoRecorte: '',
            tipoProduto: '',
            material: '',
            cor: '',
        });
        setCurrentPage(1);
        setShowFilterDropdown(false);
    };

    // Função para limpar todos os filtros (incluindo pesquisa)
    const handleClearAllFilters = () => {
        setSearchTerm('');
        setFilters({
            tipoRecorte: '',
            tipoProduto: '',
            material: '',
            cor: '',
        });
        setActiveFilter('todos');
        setCurrentPage(1);
        setShowFilterDropdown(false);
    };

    // Verificar se há filtros ativos
    const hasActiveFilters = Object.values(filters).some((value) => value !== '');
    const hasAnyFilter = hasActiveFilters || searchTerm.trim() !== '';

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
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Peças gerais</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {hasAnyFilter ? 'Resultados filtrados' : 'Gerencie todas as peças do seu catálogo'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {hasAnyFilter && (
                                    <Button
                                        variant="secondary"
                                        onClick={handleClearAllFilters}
                                        className="w-full lg:w-auto"
                                    >
                                        Limpar filtros
                                    </Button>
                                )}
                                <Button
                                    variant="primary"
                                    className="w-full lg:w-auto"
                                    onClick={() => navigate('/criar')}
                                >
                                    Adicionar peça
                                </Button>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto pb-2 scrollbar-none">
                                <button
                                    onClick={() => handleFilterChange('todos')}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                                        activeFilter === 'todos'
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                    disabled={isLoadingCounts}
                                >
                                    <span>Todos</span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-200 ${
                                            activeFilter === 'todos'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        } ${isLoadingCounts ? 'animate-pulse' : ''}`}
                                    >
                                        {isLoadingCounts ? '...' : globalCounts.todos}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('ativos')}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                                        activeFilter === 'ativos'
                                            ? 'bg-green-600 text-white shadow-md shadow-green-600/25'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                    disabled={isLoadingCounts}
                                >
                                    <span>Ativos</span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-200 ${
                                            activeFilter === 'ativos'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        } ${isLoadingCounts ? 'animate-pulse' : ''}`}
                                    >
                                        {isLoadingCounts ? '...' : globalCounts.ativos}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('inativos')}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                                        activeFilter === 'inativos'
                                            ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                    disabled={isLoadingCounts}
                                >
                                    <span>Inativos</span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-200 ${
                                            activeFilter === 'inativos'
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        } ${isLoadingCounts ? 'animate-pulse' : ''}`}
                                    >
                                        {isLoadingCounts ? '...' : globalCounts.inativos}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="flex gap-3 mb-4 lg:mb-6 relative">
                            <div className="flex-1 min-w-0">
                                <InputSearch
                                    placeholder="Pesquisar peças..."
                                    onSearch={handleSearch}
                                    value={searchTerm}
                                />
                            </div>
                            <div className="relative">
                                <button
                                    ref={filterButtonRef}
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg font-medium text-sm transition-all duration-200 flex-shrink-0 ${
                                        hasActiveFilters
                                            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    } ${showFilterDropdown ? 'ring-2 ring-blue-500' : ''}`}
                                >
                                    <FilterList className="w-4 h-4" />
                                    <span className="hidden sm:inline">Filtros</span>
                                    {hasActiveFilters && (
                                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {Object.values(filters).filter((v) => v !== '').length}
                                        </span>
                                    )}
                                </button>

                                {/* Filter Dropdown */}
                                <FilterDropdown
                                    isOpen={showFilterDropdown}
                                    onClose={() => setShowFilterDropdown(false)}
                                    filters={filters}
                                    onApply={handleFilterApply}
                                    onReset={handleFilterReset}
                                    hasActiveFilters={hasActiveFilters}
                                    triggerRef={filterButtonRef}
                                />
                            </div>
                        </div>

                        {/* Mostrar informações sobre filtros aplicados */}
                        {hasAnyFilter && !isLoading && !error && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2 text-sm text-blue-800">
                                        <FilterList className="w-4 h-4" />
                                        <span>
                                            {total === 0
                                                ? 'Nenhum resultado encontrado'
                                                : `${total} resultado${total !== 1 ? 's' : ''} encontrado${
                                                      total !== 1 ? 's' : ''
                                                  }`}
                                            {searchTerm && ` para "${searchTerm}"`}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleClearAllFilters}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Limpar todos os filtros
                                    </button>
                                </div>
                            </div>
                        )}

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
                                {pieces.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FilterList className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            {hasAnyFilter
                                                ? 'Nenhuma peça encontrada com os filtros aplicados.'
                                                : 'Nenhuma peça cadastrada.'}
                                        </p>
                                        {hasAnyFilter ? (
                                            <div className="flex gap-2 justify-center">
                                                <Button variant="secondary" onClick={handleClearAllFilters}>
                                                    Limpar filtros
                                                </Button>
                                                <Button variant="primary" onClick={() => navigate('/criar')}>
                                                    Adicionar peça
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button variant="primary" onClick={() => navigate('/criar')}>
                                                Adicionar primeira peça
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <PiecesTable
                                            pieces={pieces}
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                            onDeleteSuccess={handleDeleteSuccess}
                                            sortBy={sortBy}
                                            sortOrder={sortOrder}
                                            onSortChange={handleSortChange}
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
