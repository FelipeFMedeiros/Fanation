interface FilterTabsProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    counts: {
        todos: number;
        ativos: number;
        inativos: number;
    };
    isLoading: boolean;
}

export default function FilterTabs({ activeFilter, onFilterChange, counts, isLoading }: FilterTabsProps) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto pb-2 scrollbar-none">
                <button
                    onClick={() => onFilterChange('todos')}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                        activeFilter === 'todos'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    disabled={isLoading}
                >
                    <span>Todos</span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-200 ${
                            activeFilter === 'todos' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                        } ${isLoading ? 'animate-pulse' : ''}`}
                    >
                        {isLoading ? '...' : counts.todos}
                    </span>
                </button>
                <button
                    onClick={() => onFilterChange('ativos')}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                        activeFilter === 'ativos'
                            ? 'bg-green-600 text-white shadow-md shadow-green-600/25'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    disabled={isLoading}
                >
                    <span>Ativos</span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-200 ${
                            activeFilter === 'ativos' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                        } ${isLoading ? 'animate-pulse' : ''}`}
                    >
                        {isLoading ? '...' : counts.ativos}
                    </span>
                </button>
                <button
                    onClick={() => onFilterChange('inativos')}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                        activeFilter === 'inativos'
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    disabled={isLoading}
                >
                    <span>Inativos</span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-200 ${
                            activeFilter === 'inativos' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                        } ${isLoading ? 'animate-pulse' : ''}`}
                    >
                        {isLoading ? '...' : counts.inativos}
                    </span>
                </button>
            </div>
        </div>
    );
}
