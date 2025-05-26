import { useState, useEffect } from 'react';
import { InfoOutlined, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import FileUpload from '@/components/FileUpload';

// Types
import { CreatePieceData, Piece } from '@/types/pieces';

// Constants
import { CUT_TYPES, MODEL_TYPES, POSITIONS, DISPLAY_ORDERS, MATERIALS, MATERIAL_COLORS } from '@/constants/system';

// Services
import { recortesService } from '@/services/recortes';

export default function Product() {
    const navigate = useNavigate();
    const { sku } = useParams<{ sku: string }>();
    const isEditMode = Boolean(sku);

    const [isActive, setIsActive] = useState(true);
    const [formData, setFormData] = useState<CreatePieceData>({
        title: '',
        sku: '',
        displayOrder: 1,
        cutType: 'frente',
        position: 'frente',
        productType: 'americano', // Atualizado - agora só 'americano' ou 'trucker'
        material: 'linho',
        materialColor: 'azul marinho',
        isActive: true, // Adicionado
    });
    const [originalPiece, setOriginalPiece] = useState<Piece | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(isEditMode);
    const [error, setError] = useState<string>('');

    // Carregar dados da peça para edição
    useEffect(() => {
        if (isEditMode && sku) {
            loadPieceData(sku);
        }
    }, [isEditMode, sku]);

    const loadPieceData = async (skuToLoad: string) => {
        setIsLoadingData(true);
        setError('');

        try {
            const piece = await recortesService.getRecorteBySku(skuToLoad);
            setOriginalPiece(piece);

            // Preencher formulário com dados da peça
            setFormData({
                title: piece.title,
                sku: piece.sku,
                displayOrder: piece.displayOrder,
                cutType: piece.cutType || 'frente',
                position: piece.position || 'frente',
                productType: piece.productType,
                material: piece.material || 'linho',
                materialColor: piece.materialColor || 'azul marinho',
                imageUrl: piece.imageUrl,
                isActive: piece.isActive !== undefined ? piece.isActive : true, // Mapear status
                createdAt: piece.createdAt,
            });

            // Se tem imagem, definir preview
            if (piece.imageUrl) {
                setPreviewUrl(piece.imageUrl);
            }

            setIsActive(piece.isActive !== undefined ? piece.isActive : true);
        } catch (err) {
            console.error('Erro ao carregar peça:', err);
            setError('Erro ao carregar dados da peça. Verifique se o SKU está correto.');
        } finally {
            setIsLoadingData(false);
        }
    };

    // Gerar chave automática baseada nos dados (atualizado)
    const generateKey = () => {
        const { productType, cutType, material, materialColor } = formData;
        if (productType && cutType && material && materialColor) {
            return `${productType}-${cutType}-${material}-${materialColor.replace(' ', '_')}`;
        }
        return '';
    };

    const handleInputChange = (field: keyof CreatePieceData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Função para lidar com mudanças no SKU com máscara
    const handleSkuChange = (value: string) => {
        // Remover todos os caracteres que não são números
        const numbersOnly = value.replace(/[^0-9]/g, '');

        // Adicionar o # automaticamente
        const formattedSku = numbersOnly ? `#${numbersOnly}` : '';

        handleInputChange('sku', formattedSku);
    };

    const handleFileSelect = (file: File | null) => {
        setSelectedFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            // Se removeu o arquivo, voltar para a imagem original (se houver)
            if (formData.imageUrl) {
                setPreviewUrl(formData.imageUrl);
            } else {
                setPreviewUrl('');
            }
        }
    };

    const handleSubmit = async () => {
        // Validações obrigatórias
        if (!formData.title.trim()) {
            setError('Nome do modelo é obrigatório');
            return;
        }

        if (!formData.sku.trim()) {
            setError('SKU é obrigatório');
            return;
        }

        if (!selectedFile && !formData.imageUrl) {
            setError('Imagem é obrigatória');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            let imageUrl = formData.imageUrl || '';

            // Se há um novo arquivo selecionado, fazer upload primeiro
            if (selectedFile) {
                try {
                    const uploadResponse = await recortesService.uploadImage(selectedFile, {
                        tipoProduto: formData.productType,
                        tipoRecorte: formData.cutType || 'frente',
                        material: formData.material || 'linho',
                        cor: formData.materialColor || 'azul marinho',
                    });
                    imageUrl = uploadResponse.imageUrl;
                } catch (uploadError) {
                    console.error('Erro no upload:', uploadError);
                    throw new Error('Erro ao fazer upload da imagem');
                }
            }

            const dataToSave: CreatePieceData = {
                ...formData,
                imageUrl,
                isActive, // Incluir status
            };

            if (isEditMode && originalPiece) {
                // Atualizar peça existente
                await recortesService.updateRecorte(originalPiece.id, dataToSave);
            } else {
                // Criar nova peça
                await recortesService.createRecorte(dataToSave);
            }

            // Navegar de volta para o dashboard
            navigate('/');
        } catch (err) {
            console.error('Erro ao salvar peça:', err);
            setError(err instanceof Error ? err.message : 'Erro ao salvar peça');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscard = () => {
        navigate('/');
    };

    // Loading state para carregamento de dados
    if (isLoadingData) {
        return (
            <div className="h-screen bg-gray-50 flex flex-col">
                <Header variant="primary" />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Carregando dados da peça...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <Header variant="primary" />

            {/* Main Container */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Barra de ação superior */}
                    <div className="bg-gray-100 border-b border-gray-300 shadow-md shadow-gray-400/20 px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            {/* Aviso de informações não salvas */}
                            <div className="flex items-center gap-3">
                                <InfoOutlined className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700 font-medium">
                                    {isEditMode ? 'Editando peça' : 'Informações não salvas'}
                                </span>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                                <Button
                                    variant="secondary"
                                    onClick={handleDiscard}
                                    className="w-full sm:w-auto px-4 py-2 text-sm"
                                    disabled={isLoading}
                                >
                                    {isEditMode ? 'Cancelar' : 'Descartar'}
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    isLoading={isLoading}
                                    className="w-full sm:w-auto px-4 py-2 text-sm"
                                >
                                    {isLoading ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Salvar'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto px-4 lg:px-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 mt-6">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Seção de informações do produto */}
                        <div className="rounded-lg p-4 lg:p-6 mb-6 lg:mb-8">
                            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                                {/* Informações do produto */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <button
                                        onClick={() => navigate('/')}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                                    >
                                        <ArrowBack className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="min-w-0 flex-1">
                                        <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate">
                                            {isEditMode
                                                ? `Editar: ${formData.title || 'Peça'}`
                                                : `Modelo ${formData.productType}`}
                                        </h1>
                                        <p className="text-sm text-gray-600 truncate">
                                            {isEditMode && formData.createdAt
                                                ? `Criado em: ${new Date(formData.createdAt).toLocaleDateString(
                                                      'pt-BR',
                                                      {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      },
                                                  )}, ${new Date(formData.createdAt).toLocaleTimeString('pt-BR', {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                      hour12: false,
                                                      timeZone: 'America/Sao_Paulo',
                                                  })}`
                                                : formData.title || 'Novo Modelo'}
                                        </p>
                                    </div>
                                </div>

                                {/* Toggle Ativo/Inativo */}
                                <div className="flex items-center justify-between lg:justify-center gap-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0">
                                    <span className="text-base font-medium text-gray-700">Status:</span>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="text-sm text-gray-600 inline-block"
                                            style={{ width: 60, textAlign: 'center' }}
                                        >
                                            {isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={(e) => setIsActive(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div
                                                className={`w-12 h-7 rounded-full transition-colors duration-300
                                                    ${isActive ? '' : 'bg-gray-200'}
                                                `}
                                                style={{
                                                    backgroundColor: isActive ? '#440986' : undefined,
                                                }}
                                            >
                                                <span
                                                    className={`absolute top-[3px] left-[3px] h-5 w-5 bg-white border border-gray-300 rounded-full transition-all duration-300
                                                        ${isActive ? 'translate-x-5 border-white' : ''}
                                                    `}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulário Principal */}
                        <div className="space-y-6 lg:space-y-8">
                            {/* Primeira linha - Especificações e Dados do produto */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                {/* Coluna Esquerda - Especificações */}
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Especificações</h2>

                                    <div className="space-y-6">
                                        {/* Tipo e Nome do Modelo */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <SelectField
                                                label="Tipo do Modelo *"
                                                value={formData.productType}
                                                onChange={(e) => handleInputChange('productType', e.target.value)}
                                                options={MODEL_TYPES}
                                            />
                                            <InputField
                                                label="Nome do Modelo *"
                                                value={formData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                placeholder="Digite o nome do modelo"
                                            />
                                        </div>

                                        {/* Posição e Tipo de corte */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <SelectField
                                                label="Posição da imagem"
                                                value={formData.position}
                                                onChange={(e) => handleInputChange('position', e.target.value)}
                                                options={POSITIONS}
                                            />

                                            <SelectField
                                                label="Tipo do recorte"
                                                value={formData.cutType}
                                                onChange={(e) => handleInputChange('cutType', e.target.value)}
                                                options={CUT_TYPES}
                                            />
                                        </div>

                                        {/* Tecidos e Cor */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <SelectField
                                                label="Tecidos"
                                                value={formData.material}
                                                onChange={(e) => handleInputChange('material', e.target.value)}
                                                options={MATERIALS}
                                            />

                                            <SelectField
                                                label="Cor do tecido"
                                                value={formData.materialColor}
                                                onChange={(e) => handleInputChange('materialColor', e.target.value)}
                                                options={MATERIAL_COLORS}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Coluna Direita - Dados do produto */}
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Dados do produto</h2>

                                    <div className="space-y-6">
                                        {/* SKU com máscara personalizada */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                SKU *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={formData.sku}
                                                    onChange={(e) => handleSkuChange(e.target.value)}
                                                    placeholder="#000000"
                                                    disabled={isEditMode} // SKU não pode ser editado
                                                    className={`
                                                        w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                        font-mono text-sm
                                                        ${
                                                            isEditMode
                                                                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                                                : 'bg-white'
                                                        }
                                                    `}
                                                    maxLength={10} // # + até 9 dígitos
                                                />
                                                {/* Indicador visual do # sempre presente */}
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                    <span className="text-gray-400 font-mono text-sm">#</span>
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Digite apenas os números. O símbolo # será adicionado automaticamente.
                                            </p>
                                        </div>

                                        <SelectField
                                            label="Ordem de exibição"
                                            value={formData.displayOrder}
                                            onChange={(e) =>
                                                handleInputChange('displayOrder', parseInt(e.target.value))
                                            }
                                            options={DISPLAY_ORDERS}
                                        />

                                        {/* Chave gerada */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Chave key gerada
                                            </label>
                                            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 text-sm">
                                                {generateKey() || 'Preencha os campos para gerar a chave'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Segunda linha - Upload de mídia (largura total) */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Mídia *</h2>

                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    previewUrl={previewUrl}
                                    accept="image/*"
                                    maxSize={5}
                                    title={previewUrl ? 'Alterar imagem' : 'Carregar imagem'}
                                    subtitle={
                                        previewUrl
                                            ? 'Escolha uma nova imagem ou arraste e solte aqui'
                                            : 'Escolha um arquivo ou arraste e solte aqui'
                                    }
                                />
                            </div>
                        </div>

                        {/* Espaçamento extra para mobile */}
                        <div className="h-4 lg:h-0"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}
