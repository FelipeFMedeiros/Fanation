import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Contexts
import { AuthProvider } from '@/contexts/AuthContext';
// Components
import PrivateRoute from '@/router/PrivateRoute';
// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Product from '@/pages/Product';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* ========== ROTAS PÚBLICAS ========== */}
                    <Route
                        path="/login"
                        element={
                            <PrivateRoute requireAuth={false}>
                                <Login />
                            </PrivateRoute>
                        }
                    />

                    {/* ========== ROTAS PRIVADAS ========== */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/criar"
                        element={
                            <PrivateRoute>
                                <Product />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/editar/:sku"
                        element={
                            <PrivateRoute>
                                <Product />
                            </PrivateRoute>
                        }
                    />

                    {/* Rota catch-all - redireciona para dashboard se autenticado */}
                    <Route
                        path="*"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
