import { createContext, useState, useEffect, ReactNode } from 'react';
// Services
import { apiService } from '@/services/api';
// Types
import { AuthContextData, User } from '@/types/auth';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Apenas para validação inicial

    // Verificar se há um token salvo no localStorage e validá-lo
    useEffect(() => {
        const validateStoredToken = async () => {
            const token = localStorage.getItem('@fanation:token');

            if (token) {
                try {
                    // Validar token com a API
                    const response = await apiService.validateToken();

                    if (response.success && response.user) {
                        setUser({
                            id: response.user.id,
                            name: response.user.name,
                            role: response.user.role,
                        });
                    } else {
                        // Token inválido, remover do localStorage
                        localStorage.removeItem('@fanation:token');
                    }
                } catch (error) {
                    console.error('Erro ao validar token:', error);
                    // Token inválido, remover do localStorage
                    localStorage.removeItem('@fanation:token');
                }
            }

            setIsLoading(false);
        };

        validateStoredToken();
    }, []);

    const signIn = async (password: string) => {
        // NÃO gerenciar loading aqui - deixar para o componente Login
        try {
            // Fazer login na API
            const response = await apiService.login(password);

            if (response.success && response.token && response.user) {
                // Salvar token no localStorage
                localStorage.setItem('@fanation:token', response.token);

                // Definir usuário logado
                setUser({
                    id: response.user.id,
                    name: response.user.name,
                    role: response.user.role,
                });
            } else {
                throw new Error(response.message || 'Erro ao fazer login');
            }
        } catch (error) {
            // Garantir que o token seja removido em caso de erro
            localStorage.removeItem('@fanation:token');
            throw error; // Re-throw para o componente tratar
        }
    };

    const signOut = () => {
        localStorage.removeItem('@fanation:token');
        setUser(null);
    };

    const value: AuthContextData = {
        user,
        isAuthenticated: !!user,
        isLoading, // Apenas para validação inicial do token
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
