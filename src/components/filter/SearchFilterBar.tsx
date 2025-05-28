import { RefObject } from 'react';
import { FilterList } from '@mui/icons-material';
// Components
import InputSearch from '@/components/ui/InputSearch';
import FilterDropdown from '@/components/FilterDropdown';

interface SearchFilterBarProps {
    searchTerm: string;
    onSearch: (value: string) => void;
    showFilterDropdown: boolean;
    setShowFilterDropdown: (show: boolean) => void;
    hasActiveFilters: boolean;
    filterButtonRef: RefObject<HTMLButtonElement>;
    filters: {
        tipoRecorte: string;
        tipoProduto: string;
        material: string;
        cor: string;
    };
    onFilterApply: (filters: { tipoRecorte: string; tipoProduto: string; material: string; cor: string }) => void;
    onFilterReset: () => void;
}

export default function SearchFilterBar({
    searchTerm,
    onSearch,
    showFilterDropdown,
    setShowFilterDropdown,
    hasActiveFilters,
    filterButtonRef,
    filters,
    onFilterApply,
    onFilterReset,
}: SearchFilterBarProps) {
    return (
        <div className="flex gap-3 mb-4 lg:mb-6 relative">
            <div className="flex-1 min-w-0">
                <InputSearch placeholder="Pesquisar peças..." onSearch={onSearch} value={searchTerm} />
            </div>
            <div className="relative">
                <button
                    ref={filterButtonRef}
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className={`flex items-center justify-center gap-2 px-3 h-[3.25rem] lg:h-[2.75rem] border rounded-lg font-medium text-sm transition-all duration-200 flex-shrink-0 hover:cursor-pointer ${
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

                <FilterDropdown
                    isOpen={showFilterDropdown}
                    onClose={() => setShowFilterDropdown(false)}
                    filters={filters}
                    onApply={onFilterApply}
                    onReset={onFilterReset}
                    hasActiveFilters={hasActiveFilters}
                    triggerRef={filterButtonRef}
                />
            </div>
        </div>
    );
}
