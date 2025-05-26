import {
    RecortesListResponse,
    RecorteResponse,
    UploadImageResponse,
    RecorteCreateData,
    RecorteUpdateData,
    RecortesParams,
    RecorteApiData,
} from '@/types/api';
import { Piece, PieceListResponse, CreatePieceData } from '@/types/pieces';
import { apiService } from './api';

class RecortesService {
    // Função auxiliar para mapear dados da API para o formato frontend
    private mapApiDataToPiece(item: RecorteApiData): Piece {
        return {
            id: item.id,
            title: item.nome,
            sku: item.sku,
            displayOrder: item.ordem,
            status: item.status ? 'Ativo' : 'Inativo', // Mapear boolean para string
            cutType: item.tipoRecorte,
            position: item.posicao,
            productType: item.tipoProduto,
            material: item.material,
            materialColor: item.cor,
            imageUrl: item.urlImagem,
            isActive: item.status,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
        };
    }

    // Função auxiliar para mapear dados do frontend para a API
    private mapPieceDataToApi(data: CreatePieceData): RecorteCreateData {
        if (!data.imageUrl) {
            throw new Error('URL da imagem é obrigatória');
        }

        return {
            nome: data.title,
            ordem: data.displayOrder,
            sku: data.sku,
            tipoRecorte: data.cutType || 'frente',
            posicao: data.position || 'frente',
            tipoProduto: data.productType || 'americano', // Agora salva diretamente 'americano' ou 'trucker'
            material: data.material || 'linho',
            cor: data.materialColor || 'azul marinho',
            urlImagem: data.imageUrl, // Agora obrigatório
            status: data.isActive !== undefined ? data.isActive : true, // Mapear status
        };
    }

    // Listar recortes com paginação e filtros
    async getRecortes(params?: RecortesParams): Promise<PieceListResponse> {
        try {
            const response = await apiService.get<RecortesListResponse>('/recortes', params);

            // Mapear dados da API para o formato esperado
            const pieces: Piece[] = response.data.map((item) => this.mapApiDataToPiece(item));

            return {
                pieces,
                total: response.pagination.total,
                page: response.pagination.page,
                limit: response.pagination.limit,
                totalPages: response.pagination.totalPages,
            };
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao buscar recortes');
        }
    }

    // Buscar recorte por ID
    async getRecorteById(id: string): Promise<Piece> {
        try {
            const response = await apiService.get<RecorteResponse>(`/recortes/${id}`);
            return this.mapApiDataToPiece(response.data);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao buscar recorte');
        }
    }

    // Buscar recorte por SKU
    async getRecorteBySku(sku: string): Promise<Piece> {
        try {
            // Remover o # do SKU se estiver presente
            const cleanSku = sku.startsWith('#') ? sku.substring(1) : sku;
            console.log('Buscando recorte por SKU:', cleanSku);

            const response = await apiService.get<RecorteResponse>(`/recortes/sku/%23${encodeURIComponent(cleanSku)}`);
            return this.mapApiDataToPiece(response.data);
        } catch (error) {
            console.error('Erro ao buscar recorte por SKU:', error);
            throw new Error(error instanceof Error ? error.message : 'Erro ao buscar recorte');
        }
    }

    // Upload de imagem
    async uploadImage(
        file: File,
        data: {
            tipoProduto: string;
            tipoRecorte: string;
            material: string;
            cor: string;
        },
    ): Promise<{ imageUrl: string; publicId: string; fileName: string }> {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('tipoProduto', data.tipoProduto);
            formData.append('tipoRecorte', data.tipoRecorte);
            formData.append('material', data.material);
            formData.append('cor', data.cor);

            const response = await apiService.postFormData<UploadImageResponse>('/recortes/upload', formData);
            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem');
        }
    }

    // Criar recorte
    async createRecorte(data: CreatePieceData): Promise<Piece> {
        try {
            // Validar campos obrigatórios
            if (!data.title.trim()) throw new Error('Nome do modelo é obrigatório');
            if (!data.sku.trim()) throw new Error('SKU é obrigatório');
            if (!data.imageUrl?.trim()) throw new Error('Imagem é obrigatória');

            const apiData = this.mapPieceDataToApi(data);
            const response = await apiService.post<RecorteResponse>('/recortes', apiData);
            return this.mapApiDataToPiece(response.data);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao criar recorte');
        }
    }

    // Atualizar recorte
    async updateRecorte(id: string, data: Partial<CreatePieceData>): Promise<Piece> {
        try {
            const apiData: RecorteUpdateData = {};

            // Só incluir campos que foram alterados e têm valor válido
            if (data.title !== undefined && data.title !== '') apiData.nome = data.title;
            if (data.displayOrder !== undefined) apiData.ordem = data.displayOrder;
            if (data.cutType !== undefined) apiData.tipoRecorte = data.cutType;
            if (data.position !== undefined) apiData.posicao = data.position;
            if (data.productType !== undefined) apiData.tipoProduto = data.productType;
            if (data.material !== undefined) apiData.material = data.material;
            if (data.materialColor !== undefined) apiData.cor = data.materialColor;
            if (data.imageUrl !== undefined) apiData.urlImagem = data.imageUrl;
            if (data.isActive !== undefined) apiData.status = data.isActive; // Mapear status

            console.log('Dados para atualização:', apiData);

            const response = await apiService.put<RecorteResponse>(`/recortes/${id}`, apiData);
            return this.mapApiDataToPiece(response.data);
        } catch (error) {
            console.error('Erro ao atualizar recorte:', error);
            throw new Error(error instanceof Error ? error.message : 'Erro ao atualizar recorte');
        }
    }

    // Atualizar imagem do recorte
    async updateRecorteImage(id: string, file: File): Promise<Piece> {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await apiService.putFormData<RecorteResponse>(`/recortes/${id}/image`, formData);
            return this.mapApiDataToPiece(response.data);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao atualizar imagem');
        }
    }

    // Excluir recorte
    async deleteRecorte(id: string): Promise<void> {
        try {
            await apiService.delete(`/recortes/${id}`);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Erro ao excluir recorte');
        }
    }
}

// Exportar instância única
export const recortesService = new RecortesService();
