export interface User {
    id: string;
    email: string;
    name: string;
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
