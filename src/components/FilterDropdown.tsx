import { useState, useEffect, useRef } from 'react';
import { Close, FilterList } from '@mui/icons-material';
// Components
import Button from './ui/Button';
// Constants
import { CUT_TYPES, PRODUCT_TYPES, MATERIALS, MATERIAL_COLORS } from '@/constants/system';

interface FilterDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        tipoRecorte: string;
        tipoProduto: string;
        material: string;
        cor: string;
    };
    onApply: (filters: { tipoRecorte: string; tipoProduto: string; material: string; cor: string }) => void;
    onReset: () => void;
    hasActiveFilters: boolean;
    triggerRef: React.RefObject<HTMLButtonElement>;
}

export default function FilterDropdown({
    isOpen,
    onClose,
    filters,
    onApply,
    onReset,
    hasActiveFilters,
    triggerRef,
}: FilterDropdownProps) {
    const [localFilters, setLocalFilters] = useState(filters);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // Fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, triggerRef]);

    // Fechar com ESC
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleApply = () => {
        onApply(localFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            tipoRecorte: '',
            tipoProduto: '',
            material: '',
            cor: '',
        };
        setLocalFilters(resetFilters);
        onReset();
    };

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const hasLocalChanges = JSON.stringify(localFilters) !== JSON.stringify(filters);

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[calc(100vh-200px)] overflow-y-auto"
            style={{
                // Garantir que não saia da tela
                maxWidth: 'calc(100vw - 2rem)',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <FilterList className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
                    {hasActiveFilters && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Ativos</span>
                    )}
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <Close className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Tipo de Recorte */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Tipo de Recorte</label>
                    <select
                        value={localFilters.tipoRecorte}
                        onChange={(e) => handleFilterChange('tipoRecorte', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Todos os tipos</option>
                        {CUT_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tipo de Produto */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Tipo de Produto</label>
                    <select
                        value={localFilters.tipoProduto}
                        onChange={(e) => handleFilterChange('tipoProduto', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Todos os produtos</option>
                        {PRODUCT_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Material */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Material</label>
                    <select
                        value={localFilters.material}
                        onChange={(e) => handleFilterChange('material', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Todos os materiais</option>
                        {MATERIALS.map((material) => (
                            <option key={material.value} value={material.value}>
                                {material.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Cor */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Cor do Material</label>
                    <select
                        value={localFilters.cor}
                        onChange={(e) => handleFilterChange('cor', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Todas as cores</option>
                        {MATERIAL_COLORS.map((color) => (
                            <option key={color.value} value={color.value}>
                                {color.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50">
                <Button
                    variant="secondary"
                    onClick={handleReset}
                    className="flex-1 text-sm py-2"
                    disabled={!hasActiveFilters}
                >
                    Limpar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleApply}
                    className={`flex-1 text-sm py-2 ${hasLocalChanges ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                    {hasLocalChanges ? 'Aplicar' : 'Fechar'}
                </Button>
            </div>
        </div>
    );
}
