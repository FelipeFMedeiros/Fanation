import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Contexts
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
// Components
import PrivateRoute from '@/router/PrivateRoute';
// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Product from '@/pages/Product';
import Visualization from '@/pages/Visualization';
import ImageGenerator from '@/pages/ImageGenerator';
import Users from '@/pages/Users';
import UserForm from '@/pages/UserForm';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <ToastProvider>
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

                        {/* Dashboard - Rota principal */}
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />

                        <Route path="/dashboard" element={<Navigate to="/" replace />} />

                        {/* Gestão de Peças */}
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

                        {/* Visualização */}
                        <Route
                            path="/visualizacao"
                            element={
                                <PrivateRoute>
                                    <Visualization />
                                </PrivateRoute>
                            }
                        />

                        {/* Image Generator */}
                        <Route
                            path="/visualizacao/gerador"
                            element={
                                <PrivateRoute>
                                    <ImageGenerator />
                                </PrivateRoute>
                            }
                        />

                        {/* Gestão de Usuários */}
                        <Route
                            path="/usuarios"
                            element={
                                <PrivateRoute>
                                    <Users />
                                </PrivateRoute>
                            }
                        />

                        {/* Criar usuário */}
                        <Route
                            path="/usuarios/criar"
                            element={
                                <PrivateRoute>
                                    <UserForm />
                                </PrivateRoute>
                            }
                        />

                        {/* Editar usuário */}
                        <Route
                            path="/usuarios/editar/:userId"
                            element={
                                <PrivateRoute>
                                    <UserForm />
                                </PrivateRoute>
                            }
                        />

                        {/* Rota catch-all - redireciona para dashboard se autenticado */}
                        <Route
                            path="*"
                            element={
                                <PrivateRoute>
                                    <Navigate to="/" replace />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}
