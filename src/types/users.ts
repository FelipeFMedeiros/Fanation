export interface User {
    id: string;
    name: string;
    role: string;
    description?: string;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: string;
    creatorName: string;
}

export interface CreateUserData {
    name: string;
    password: string;
    description?: string;
}

export interface UpdateUserData {
    userId: string;
    name?: string;
    description?: string;
}

export interface DeleteUserData {
    userId: string;
}

export interface UserListResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: 'name' | 'createdAt' | 'role';
    sortOrder?: 'asc' | 'desc';
}
