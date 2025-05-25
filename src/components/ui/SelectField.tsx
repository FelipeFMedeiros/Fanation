import { SelectHTMLAttributes, ReactNode } from 'react';
import { ExpandMore } from '@mui/icons-material';

interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string;
    error?: string;
    helper?: string;
    placeholder?: string;
    options: SelectOption[];
    leftIcon?: ReactNode;
    variant?: 'default' | 'outlined';
}

export default function SelectField({
    label,
    error,
    helper,
    placeholder,
    options,
    leftIcon,
    variant = 'default',
    className = '',
    ...props
}: SelectFieldProps) {
    const baseClasses = `
        w-full px-3 py-2 text-sm
        border rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-colors duration-200
        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
        appearance-none cursor-pointer
        bg-white
    `;

    const variants = {
        default: `
            border-gray-300 
            hover:border-gray-400
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `,
        outlined: `
            border-2 border-gray-200
            hover:border-gray-300
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `,
    };

    const selectClasses = `
        ${baseClasses}
        ${variants[variant]}
        ${leftIcon ? 'pl-10' : ''}
        pr-10
        ${className}
    `;

    return (
        <div className="w-full">
            {/* Label */}
            {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

            {/* Select Container */}
            <div className="relative">
                {/* Left Icon */}
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <div className="text-gray-400">{leftIcon}</div>
                    </div>
                )}

                {/* Select */}
                <select className={selectClasses} {...props}>
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Dropdown Arrow Icon */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExpandMore className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Error Message */}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

            {/* Helper Text */}
            {helper && !error && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
        </div>
    );
}
