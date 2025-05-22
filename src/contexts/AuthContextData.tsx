import { useContext } from 'react';
// Context
import AuthContext from './AuthContext';
// Types
import { AuthContextData } from '../types/auth';

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
}
