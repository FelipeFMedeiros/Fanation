import { InputHTMLAttributes, forwardRef, useState } from 'react';
// MUI Icons
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    variant?: 'primary' | 'password';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', variant = 'primary', type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        // Determine actual input type based on variant and visibility state
        const inputType = variant === 'password' ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className="w-full">
                {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
                <div className="relative">
                    <input
                        ref={ref}
                        type={inputType}
                        className={`
                        w-full px-4 py-3 rounded-lg border border-gray-300 
                        focus:ring-2 focus:ring-purple-500 focus:border-transparent
                        focus:outline-none
                        placeholder-gray-400 text-gray-900
                        transition-all duration-200
                        ${error ? 'border-red-500 focus:ring-red-500' : ''}
                        ${variant === 'password' ? 'pr-12' : ''}
                        ${className}
                    `}
                        {...props}
                    />

                    {variant === 'password' && (
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            tabIndex={-1}
                        >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </button>
                    )}
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
