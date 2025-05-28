import { Search, Close } from '@mui/icons-material';
import { InputHTMLAttributes, useState } from 'react';

interface InputSearchProps extends InputHTMLAttributes<HTMLInputElement> {
    onSearch?: (value: string) => void;
    onClear?: () => void;
}

export default function InputSearch({
    onSearch,
    onClear,
    placeholder = 'Pesquisar...',
    className = '',
    value,
    ...props
}: InputSearchProps) {
    const [internalValue, setInternalValue] = useState(value ?? '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onSearch?.(newValue);
        props.onChange?.(e);
    };

    const handleClear = () => {
        setInternalValue('');
        onSearch?.('');
        onClear?.();
    };

    const displayValue = value !== undefined ? value : internalValue;

    return (
        <div className={`relative ${className}`}>
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
            </div>

            {/* Input */}
            <input
                type="text"
                className="
        block w-full pl-9 lg:pl-10 pr-10 h-[3.25rem] lg:h-[2.75rem]
        border border-gray-300 rounded-lg
        bg-white text-gray-900 placeholder-gray-500
        text-sm lg:text-base
        focus:outline-none focus:ring-2 focus:ring-[#440986] focus:border-transparent
        transition-all duration-200 ease-in-out
        hover:border-gray-400
    "
                placeholder={placeholder}
                value={displayValue}
                onChange={handleChange}
                {...props}
            />

            {/* Clear Button */}
            {displayValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="
                        absolute inset-y-0 right-0 pr-3 flex items-center
                        text-gray-400 hover:text-gray-600
                        transition-colors duration-200
                        focus:outline-none focus:text-gray-600
                    "
                    aria-label="Limpar pesquisa"
                >
                    <Close className="h-4 w-4 lg:h-5 lg:w-5" />
                </button>
            )}
        </div>
    );
}
