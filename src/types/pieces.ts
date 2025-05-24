export interface Piece {
    id: string;
    title: string;
    sku: string;
    type: 'Americano' | 'Trucker';
    displayOrder: number;
    status: 'Ativo' | 'Inativo' | 'Expirado';
    cutType?: 'frente' | 'aba' | 'lateral';
    position?: 'frente' | 'traseira';
    productType?: 'boné americano' | 'boné trucker';
    material?: 'linho';
    materialColor?: 'azul marinho' | 'laranja';
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Types for API responses
export interface PieceListResponse {
    pieces: Piece[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Types for filtering and search
export interface PieceFilters {
    status?: Piece['status'];
    type?: Piece['type'];
    cutType?: Piece['cutType'];
    material?: Piece['material'];
    search?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

// Types for form data
export interface CreatePieceData {
    title: string;
    sku: string;
    type: Piece['type'];
    displayOrder: number;
    cutType: Piece['cutType'];
    position: Piece['position'];
    productType: Piece['productType'];
    material: Piece['material'];
    materialColor: Piece['materialColor'];
    image?: File;
}

export interface UpdatePieceData extends Partial<CreatePieceData> {
    id: string;
}
