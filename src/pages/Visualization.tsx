import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterList } from '@mui/icons-material';

// Components
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import SelectablePiecesTable from '@/components/SelectablePiecesTable';
import FilterTabs from '@/components/filter/FilterTabs';
import SearchFilterBar from '@/components/filter/SearchFilterBar';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import ErrorMessage from '@/components/ui/ErrorMessage';

// Hooks
import useFilterManagement from '@/hooks/useFilterManagement';

// Types
import { Piece } from '@/types/pieces';

export default function Visualization() {
    const navigate = useNavigate();

    // Usando o hook de gerenciamento de filtros
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

    // Local states
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // State for selected pieces - unique to the visualization page
    const [selectedPieces, setSelectedPieces] = useState<string[]>([]);

    // Load counts when filters or search change
    useEffect(() => {
        loadFilteredCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, filters]);

    // Load pieces when page or filters change
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

    // Handle selection of pieces
    const handleSelectPiece = (sku: string) => {
        setSelectedPieces((prevSelected) => {
            if (prevSelected.includes(sku)) {
                return prevSelected.filter((s) => s !== sku);
            } else {
                return [...prevSelected, sku];
            }
        });
    };

    // Generate image function
    const handleGenerateImage = () => {
        if (selectedPieces.length === 0) return;

        // Navigate to the image generator page with selected SKUs as state
        navigate('/visualizacao/gerador', {
            state: { selectedPieces },
        });
    };

    return (
        <PageLayout>
            {/* Page Header */}
            <PageHeader
                title="Visualização de Peças"
                subtitle={hasAnyFilter ? 'Resultados filtrados' : 'Selecione peças para gerar visualizações'}
                actions={
                    <>
                        {hasAnyFilter && (
                            <Button variant="secondary" onClick={handleClearAllFilters} className="w-full lg:w-auto">
                                Limpar filtros
                            </Button>
                        )}
                        <Button
                            variant="primary"
                            className="w-full lg:w-auto"
                            onClick={handleGenerateImage}
                            disabled={selectedPieces.length === 0}
                        >
                            Gerar Imagem
                            {selectedPieces.length > 0 && ` (${selectedPieces.length})`}
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
                            {hasAnyFilter && (
                                <Button variant="secondary" onClick={handleClearAllFilters}>
                                    Limpar filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <SelectablePiecesTable
                                pieces={pieces}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSortChange={handleSortChange}
                                selectedPieces={selectedPieces}
                                onSelectPiece={handleSelectPiece}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Selected Pieces Bottom Bar */}
            {selectedPieces.length > 0 && (
                <div className="fixed bottom-0 inset-x-0 z-10">
                    {/* This div accounts for the sidebar on larger screens */}
                    <div className="lg:pl-64 transition-all duration-300">
                        <div className="bg-blue-600 text-white py-3 px-4 shadow-lg">
                            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl">
                                <div className="flex items-center">
                                    <span className="font-medium text-sm sm:text-base">
                                        {selectedPieces.length}{' '}
                                        {selectedPieces.length === 1 ? 'peça selecionada' : 'peças selecionadas'}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setSelectedPieces([])}
                                        className="text-xs sm:text-sm text-white hover:text-blue-100 font-medium underline whitespace-nowrap w-full sm:w-auto order-1 sm:order-none"
                                    >
                                        Limpar seleção
                                    </button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleGenerateImage}
                                        className="whitespace-nowrap w-full sm:w-auto"
                                    >
                                        Gerar Imagem
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}
