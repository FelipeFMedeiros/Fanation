import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses = `
    inline-flex items-center justify-center font-medium
    rounded-lg transition-all duration-200 ease-in-out
    focus:outline-none
    cursor-pointer select-none
    transform hover:scale-104 active:scale-97
    hover:shadow-lg active:shadow-md
    disabled:cursor-not-allowed disabled:transform-none 
    disabled:hover:scale-100 disabled:shadow-none
    `;

    const variants = {
        primary: `
            bg-gray-900 text-white 
            hover:bg-gray-800 hover:shadow-gray-900/25
            active:bg-gray-950
            focus:ring-gray-500 
            disabled:bg-gray-400 disabled:hover:bg-gray-400
        `,
        secondary: `
            bg-white text-gray-900 border border-gray-300
            hover:bg-gray-50 hover:border-gray-400 hover:shadow-gray-200/50
            active:bg-gray-100 active:border-gray-500
            focus:ring-gray-500
            disabled:bg-gray-100 disabled:text-gray-400 
            disabled:hover:bg-gray-100 disabled:hover:border-gray-300
        `,
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
    };

    return (
        <button
            className={`
                ${baseClasses}
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Carregando...
                </div>
            ) : (
                children
            )}
        </button>
    );
}
