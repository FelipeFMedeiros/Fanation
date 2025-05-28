import { useState, useRef } from 'react';
import { recortesService } from '@/services/recortes';

export default function useFilterManagement() {
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const [activeFilter, setActiveFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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
    const [globalCounts, setGlobalCounts] = useState({
        todos: 0,
        ativos: 0,
        inativos: 0,
    });
    const [isLoadingCounts, setIsLoadingCounts] = useState(false);

    // Function to load counts with filters applied
    const loadFilteredCounts = async () => {
        setIsLoadingCounts(true);
        try {
            const baseParams = {
                page: 1,
                limit: 1,
                ...(searchTerm.trim() && { search: searchTerm.trim() }),
                ...(filters.tipoRecorte && { tipoRecorte: filters.tipoRecorte }),
                ...(filters.tipoProduto && { tipoProduto: filters.tipoProduto }),
                ...(filters.material && { material: filters.material }),
                ...(filters.cor && { cor: filters.cor }),
            };

            const [todosResponse, ativosResponse, inativosResponse] = await Promise.all([
                recortesService.getRecortes(baseParams),
                recortesService.getRecortes({ ...baseParams, status: true }),
                recortesService.getRecortes({ ...baseParams, status: false }),
            ]);

            setGlobalCounts({
                todos: todosResponse.total,
                ativos: ativosResponse.total,
                inativos: inativosResponse.total,
            });
        } catch (err) {
            console.error('Error loading counts:', err);
        } finally {
            setIsLoadingCounts(false);
        }
    };

    // Function to load pieces with current filters
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

            return {
                pieces: response.pieces,
                totalPages: response.totalPages,
                total: response.total,
            };
        } catch (err) {
            console.error('Error loading pieces:', err);
            setError('Erro ao carregar peças. Tente novamente.');
            return { pieces: [], totalPages: 0, total: 0 };
        } finally {
            setIsLoading(false);
        }
    };

    // Handler functions
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
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

    // Computed values
    const hasActiveFilters = Object.values(filters).some((value) => value !== '');
    const hasAnyFilter = hasActiveFilters || searchTerm.trim() !== '';

    return {
        filterButtonRef,
        activeFilter,
        searchTerm,
        currentPage,
        totalPages,
        setTotalPages,
        total,
        setTotal,
        isLoading,
        error,
        setError,
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
    };
}
