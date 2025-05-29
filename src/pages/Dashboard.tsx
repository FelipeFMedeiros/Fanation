import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterList } from '@mui/icons-material';
// Components
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import PiecesTable from '@/components/PiecesTable';
import FilterTabs from '@/components/filter/FilterTabs';
import SearchFilterBar from '@/components/filter/SearchFilterBar';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import ErrorMessage from '@/components/ui/ErrorMessage';
// Hooks
import useFilterManagement from '@/hooks/useFilterManagement';
// Types
import { Piece } from '@/types/pieces';
import AddIcon from '@mui/icons-material/Add';

export default function Dashboard() {
    const navigate = useNavigate();
    const {
        filterButtonRef,
        activeFilter,
        searchTerm,
        currentPage,
        isLoading,
        error,
        showFilterDropdown,
        setShowFilterDropdown,
        sortBy,
        sortOrder,
        filters,
        globalCounts,
        isLoadingCounts,
        loadFilteredCounts,
        loadPieces,
        handleFilterChange,
        handleSearch,
        handlePageChange,
        handleSortChange,
        handleFilterApply,
        handleFilterReset,
        handleClearAllFilters,
        hasActiveFilters,
        hasAnyFilter,
    } = useFilterManagement();

    const [pieces, setPieces] = useState<Piece[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Carrega contagens globais ao montar o componente
    useEffect(() => {
        loadFilteredCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, filters]);

    // Carrega as peças ao montar o componente ou quando os filtros/termos de pesquisa mudam
    useEffect(() => {
        const fetchPieces = async () => {
            const result = await loadPieces();
            setPieces(result.pieces);
            setTotalPages(result.totalPages);
            setTotal(result.total);
        };

        fetchPieces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchTerm, activeFilter, sortBy, sortOrder, filters]);

    // Função para lidar com sucesso na exclusão de uma peça
    const handleDeleteSuccess = () => {
        loadFilteredCounts();
        loadPieces().then((result) => {
            setPieces(result.pieces);
            setTotalPages(result.totalPages);
            setTotal(result.total);
        });
    };

    return (
        <PageLayout>
            {/* Page Header */}
            <PageHeader
                title="Peças gerais"
                subtitle={hasAnyFilter ? 'Resultados filtrados' : 'Gerencie todas as peças do seu catálogo'}
                actions={
                    <>
                        {hasAnyFilter && (
                            <Button variant="secondary" onClick={handleClearAllFilters} className="w-full lg:w-auto">
                                Limpar filtros
                            </Button>
                        )}
                        <Button variant="primary" className="w-full lg:w-auto" onClick={() => navigate('/criar')}>
                            <AddIcon className="mr-2" />
                            Adicionar peça
                        </Button>
                    </>
                }
            />

            {/* Filter Tabs */}
            <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                counts={globalCounts}
                isLoading={isLoadingCounts}
            />

            {/* Search and Filter Bar */}
            <SearchFilterBar
                searchTerm={searchTerm}
                onSearch={handleSearch}
                showFilterDropdown={showFilterDropdown}
                setShowFilterDropdown={setShowFilterDropdown}
                hasActiveFilters={hasActiveFilters}
                filterButtonRef={filterButtonRef}
                filters={filters}
                onFilterApply={handleFilterApply}
                onFilterReset={handleFilterReset}
            />

            {/* Filter information */}
            {hasAnyFilter && !isLoading && !error && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-sm text-blue-800">
                            <FilterList className="w-4 h-4" />
                            <span>
                                {total === 0
                                    ? 'Nenhum resultado encontrado'
                                    : `${total} resultado${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
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
                <ErrorMessage
                    message={error}
                    onRetry={() => {
                        loadPieces().then((result) => {
                            setPieces(result.pieces);
                            setTotalPages(result.totalPages);
                            setTotal(result.total);
                        });
                    }}
                />
            )}

            {/* Loading State */}
            {isLoading && <LoadingIndicator message="Carregando peças..." />}

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
        </PageLayout>
    );
}
