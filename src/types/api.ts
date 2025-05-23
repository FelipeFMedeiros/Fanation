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
