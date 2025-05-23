import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// Contexts
import { useAuth } from '../contexts/AuthContextData';
// Components
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface PrivateRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

export default function PrivateRoute({ children, requireAuth = true, redirectTo = '/login' }: PrivateRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mb-4" />
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    // Se requer autenticação e não está autenticado
    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Se não requer autenticação mas está autenticado (ex: página de login)
    if (!requireAuth && isAuthenticated) {
        // Redirecionar para onde o usuário estava tentando ir, ou para home
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
}
