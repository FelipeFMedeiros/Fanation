import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Types
import { LoginRequest, LoginResponse, UserInfo } from '@/types/api';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para adicionar token nas requisições
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('@fanation:token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );

        // Interceptor para tratar respostas e erros
        this.api.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError) => {
                // Se o token expirou ou é inválido, remover do localStorage
                if (error.response?.status === 401) {
                    localStorage.removeItem('@fanation:token');
                    // Redirecionar para login se necessário
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            },
        );
    }

    // Método para fazer login
    async login(password: string): Promise<LoginResponse> {
        try {
            const response = await this.api.post<LoginResponse>('/auth/login', {
                password,
            } as LoginRequest);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || error.response?.data?.error || 'Erro ao fazer login';
                throw new Error(errorMessage);
            }
            throw new Error('Erro interno do servidor');
        }
    }

    // Método para validar token
    async validateToken(): Promise<{ success: boolean; user: UserInfo; message: string }> {
        try {
            const response = await this.api.get<{ success: boolean; user: UserInfo; message: string }>(
                '/auth/validate',
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Token inválido';
                throw new Error(errorMessage);
            }
            throw new Error('Erro ao validar token');
        }
    }

    // Método genérico para outras requisições (futuro uso)
    async get<T>(endpoint: string): Promise<T> {
        try {
            const response = await this.api.get<T>(endpoint);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Erro na requisição');
            }
            throw error;
        }
    }

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        try {
            const response = await this.api.post<T>(endpoint, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Erro na requisição');
            }
            throw error;
        }
    }

    async put<T>(endpoint: string, data: unknown): Promise<T> {
        try {
            const response = await this.api.put<T>(endpoint, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Erro na requisição');
            }
            throw error;
        }
    }

    async delete<T>(endpoint: string): Promise<T> {
        try {
            const response = await this.api.delete<T>(endpoint);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Erro na requisição');
            }
            throw error;
        }
    }
}

// Exportar instância única
export const apiService = new ApiService();
