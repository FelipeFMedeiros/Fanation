import { InputHTMLAttributes, ReactNode, useState, useEffect } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    variant?: 'default' | 'outlined';
}

export default function InputField({
    label,
    error,
    helper,
    leftIcon,
    rightIcon,
    variant = 'default',
    className = '',
    value,
    onChange,
    ...props
}: InputFieldProps) {
    const [internalValue, setInternalValue] = useState(value || '');

    // Verificar se é um campo SKU
    const isSKUField = label === 'SKU';

    // Função para formatar o SKU
    const formatSKU = (inputValue: string) => {
        // Remove tudo que não seja número
        const numbersOnly = inputValue.replace(/[^0-9]/g, '');

        // Se tem números, adiciona o #, senão retorna vazio
        return numbersOnly ? `#${numbersOnly}` : '';
    };

    // Atualizar valor interno quando value prop mudar
    useEffect(() => {
        if (isSKUField && value) {
            // Se é SKU e tem valor, garantir que está formatado
            const formattedValue =
                typeof value === 'string'
                    ? value.startsWith('#')
                        ? value
                        : formatSKU(value)
                    : formatSKU(String(value));
            setInternalValue(formattedValue);
        } else {
            setInternalValue(value || '');
        }
    }, [value, isSKUField]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (isSKUField) {
            // Para SKU, formatar o valor
            const formattedValue = formatSKU(inputValue);
            setInternalValue(formattedValue);

            // Chamar onChange com o valor formatado
            if (onChange) {
                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: formattedValue,
                    },
                };
                onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
            }
        } else {
            // Para outros campos, usar valor normal
            setInternalValue(inputValue);
            if (onChange) {
                onChange(e);
            }
        }
    };

    const baseClasses = `
        w-full px-3 py-2 text-sm
        border rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-colors duration-200
        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
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

    const inputClasses = `
        ${baseClasses}
        ${variants[variant]}
        ${leftIcon ? 'pl-10' : ''}
        ${rightIcon ? 'pr-10' : ''}
        ${className}
    `;

    return (
        <div className="w-full">
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {isSKUField && <span className="text-xs text-gray-500 ml-1">(apenas números)</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Left Icon */}
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="text-gray-400">{leftIcon}</div>
                    </div>
                )}

                {/* Input */}
                <input
                    className={inputClasses}
                    value={internalValue}
                    onChange={handleInputChange}
                    placeholder={isSKUField ? 'Digite apenas números (ex: 123)' : props.placeholder}
                    {...props}
                />

                {/* Right Icon */}
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="text-gray-400">{rightIcon}</div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

            {/* Helper Text */}
            {helper && !error && <p className="mt-1 text-sm text-gray-500">{helper}</p>}

            {/* SKU Helper Text */}
            {isSKUField && !error && !helper && (
                <p className="mt-1 text-xs text-gray-500">O # será adicionado automaticamente</p>
            )}
        </div>
    );
}
