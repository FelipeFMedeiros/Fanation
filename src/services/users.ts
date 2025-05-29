import { apiService } from './api';
import { User, CreateUserData, UpdateUserData, UserListResponse, UsersParams } from '@/types/users';
import { UserApiData, UsersListResponse, UserResponse, UserCreateData, UserUpdateData, UserDeleteData } from '@/types/api';

class UsersService {
    // Função auxiliar para mapear dados da API para o formato frontend
    private mapApiDataToUser(item: UserApiData): User {
        return {
            id: item.id,
            name: item.name,
            role: item.role,
            description: item.description,
            createdAt: new Date(item.createdAt),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
            createdBy: item.createdBy,
            creatorName: item.creatorName,
        };
    }

    // Função auxiliar para mapear dados do frontend para a API
    private mapUserDataToApi(data: CreateUserData): UserCreateData {
        return {
            name: data.name,
            password: data.password,
            description: data.description,
        };
    }

    // Listar usuários
    async getUsers(params?: UsersParams): Promise<UserListResponse> {
        try {
            // Preparar parâmetros da query
            const queryParams: Record<string, unknown> = {};
            
            if (params?.search && params.search.trim()) {
                queryParams.search = params.search.trim();
            }
            
            if (params?.sortBy) {
                queryParams.sortBy = params.sortBy;
            }
            
            if (params?.sortOrder) {
                queryParams.sortOrder = params.sortOrder;
            }

            const response = await apiService.get<UsersListResponse>('/users', queryParams);

            // Mapear dados da API para o formato esperado
            const users: User[] = response.users.map((item) => this.mapApiDataToUser(item));

            // A API agora retorna o total real e os filtros aplicados
            const page = params?.page || 1;
            const limit = params?.limit || 10;

            // Como a API não faz paginação ainda, simular localmente
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedUsers = users.slice(startIndex, endIndex);

            return {
                users: paginatedUsers,
                total: users.length, // Total real dos dados retornados
                page,
                limit,
                totalPages: Math.ceil(users.length / limit),
            };
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao buscar usuários');
        }
    }

    // Criar usuário
    async createUser(data: CreateUserData): Promise<string> {
        try {
            // Validar campos obrigatórios
            if (!data.name.trim()) throw new Error('Nome do usuário é obrigatório');
            if (!data.password.trim()) throw new Error('Senha é obrigatória');
            if (data.password.length < 4) throw new Error('Senha deve ter pelo menos 4 caracteres');

            const apiData = this.mapUserDataToApi(data);
            const response = await apiService.post<UserResponse>('/users', apiData);

            if (!response.userId) {
                throw new Error('Erro ao criar usuário: ID não retornado');
            }

            return response.userId;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao criar usuário');
        }
    }

    // Atualizar usuário
    async updateUser(data: UpdateUserData): Promise<void> {
        try {
            if (!data.userId) throw new Error('ID do usuário é obrigatório');
            if (data.name && !data.name.trim()) throw new Error('Nome não pode estar vazio');

            const apiData: UserUpdateData = {
                userId: data.userId,
                name: data.name,
                description: data.description,
            };

            await apiService.put<UserResponse>('/users/update', apiData);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao atualizar usuário');
        }
    }

    // Deletar usuário
    async deleteUser(userId: string): Promise<void> {
        try {
            if (!userId) throw new Error('ID do usuário é obrigatório');

            const data: UserDeleteData = { userId };
            await apiService.delete<UserResponse>('/users/delete', data);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao deletar usuário');
        }
    }
}

export const usersService = new UsersService();