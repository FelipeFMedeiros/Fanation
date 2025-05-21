import { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextData, User } from '@/types/auth';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar se há um token salvo no localStorage
    useEffect(() => {
        const token = localStorage.getItem('@fanation:token');

        if (token) {
            // TODO: Validar token com a API no futuro
            // Por enquanto, simulamos um usuário logado
            setUser({
                id: '1',
                email: 'admin@fanation.com',
                name: 'Administrador',
            });
        }

        setIsLoading(false);
    }, []);

    const signIn = async (password: string) => {
        try {
            setIsLoading(true);

            // TODO: Implementar chamada para API de autenticação
            // Por enquanto, simulamos um login com senha fixa
            if (password === 'admin') {
                const mockUser: User = {
                    id: '1',
                    email: 'admin@fanation.com',
                    name: 'Administrador',
                };

                // Simular token
                const mockToken = 'mock-jwt-token';
                localStorage.setItem('@fanation:token', mockToken);

                setUser(mockUser);
            } else {
                throw new Error('Senha incorreta');
            }
        // eslint-disable-next-line no-useless-catch
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = () => {
        localStorage.removeItem('@fanation:token');
        setUser(null);
    };

    const value: AuthContextData = {
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
