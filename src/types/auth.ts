export interface User {
    id: string;
    name: string;
    email?: string;
    role?: string;
}

export interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (password: string) => Promise<void>;
    signOut: () => void;
}

export interface LoginFormData {
    password: string;
}
