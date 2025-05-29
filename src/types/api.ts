export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    error?: string;
    data?: T;
}

export interface LoginRequest {
    password: string;
}

export interface UserInfo {
    id: string;
    name: string;
    role?: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: UserInfo;
    message: string;
}

// Tipos específicos para API de recortes
export interface RecorteApiData {
    id: string;
    nome: string;
    sku: string;
    ordem: number;
    tipoRecorte: 'frente' | 'aba' | 'lateral';
    posicao: 'frente' | 'traseira';
    tipoProduto: 'americano' | 'trucker';
    material: 'linho';
    cor: 'azul marinho' | 'laranja';
    urlImagem: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RecortesListResponse {
    success: boolean;
    data: RecorteApiData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface RecorteResponse {
    success: boolean;
    data: RecorteApiData;
}

export interface UploadImageResponse {
    success: boolean;
    data: {
        imageUrl: string;
        publicId: string;
        fileName: string;
    };
}

export interface RecorteCreateData {
    nome: string;
    ordem: number;
    sku: string;
    tipoRecorte: 'frente' | 'aba' | 'lateral';
    posicao: 'frente' | 'traseira';
    tipoProduto: 'americano' | 'trucker';
    material: 'linho';
    cor: 'azul marinho' | 'laranja';
    urlImagem: string;
    status?: boolean; // Opcional, default true
}

export type RecorteUpdateData = Partial<RecorteCreateData>;

export interface RecortesParams {
    [key: string]: unknown;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    tipoRecorte?: string;
    tipoProduto?: string;
    material?: string;
    cor?: string;
    status?: boolean;
}

export interface UserApiData {
    id: string;
    name: string;
    role: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
    createdBy: string;
    creatorName: string;
}

export interface UsersListResponse {
    success: boolean;
    users: UserApiData[];
    total: number;
    filters: {
        search: string | null;
        sortBy: string;
        sortOrder: string;
    };
    message?: string;
}

export interface UserResponse {
    success: boolean;
    userId?: string;
    message?: string;
}

export interface UserCreateData {
    name: string;
    password: string;
    description?: string;
}

export interface UserUpdateData {
    userId: string;
    name?: string;
    description?: string;
}

export interface UserDeleteData {
    userId: string;
}
