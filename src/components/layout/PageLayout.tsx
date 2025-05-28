import { ReactNode } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface PageLayoutProps {
    children: ReactNode;
    headerVariant?: 'primary' | 'secondary';
}

export default function PageLayout({ children, headerVariant = 'primary' }: PageLayoutProps) {
    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <Header variant={headerVariant} />

            {/* Main Container */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-8 pt-16 lg:pt-8">
                        {children}
                        {/* Extra spacing for mobile */}
                        <div className="h-20 lg:h-8"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}
