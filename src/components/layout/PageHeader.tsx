import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    backAction?: () => void;
    backIcon?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions, backAction, backIcon }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 mb-6 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
            <div className={`${backAction ? 'flex items-center gap-3' : ''}`}>
                {backAction && backIcon && (
                    <button
                        onClick={backAction}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        {backIcon}
                    </button>
                )}
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
                    {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                </div>
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
    );
}
