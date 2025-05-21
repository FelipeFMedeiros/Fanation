import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContextData';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                {/* Rota pública - Login */}
                <Route path="/login" element={isAuthenticated ? <Navigate to="/Dashboard" replace /> : <Login />} />

                {/* Rotas privadas */}
                <Route
                    path="/Dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                {/* Redirecionamento padrão */}
                <Route path="/" element={<Navigate to={isAuthenticated ? '/Dashboard' : '/login'} replace />} />

                {/* Rota 404 */}
                <Route path="*" element={<Navigate to={isAuthenticated ? '/Dashboard' : '/login'} replace />} />
            </Routes>
        </BrowserRouter>
    );
}
