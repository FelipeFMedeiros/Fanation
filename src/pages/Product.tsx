import { useState } from 'react';
import { InfoOutlined, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Components
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import FileUpload from '@/components/FileUpload';

// Types
import { CreatePieceData } from '@/types/pieces';

// Constants
import { CUT_TYPES, POSITIONS, DISPLAY_ORDERS, MATERIALS, MATERIAL_COLORS } from '@/constants/system';

export default function Product() {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(true);
    const [formData, setFormData] = useState<CreatePieceData>({
        title: '',
        sku: '',
        type: 'Americano',
        displayOrder: 1,
        cutType: 'frente',
        position: 'frente',
        productType: 'boné americano',
        material: 'linho',
        materialColor: 'azul marinho',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Gerar chave automática baseada nos dados
    const generateKey = () => {
        const { cutType, type, material, materialColor } = formData;
        if (cutType && type && material && materialColor) {
            return `${cutType}-${type.toLowerCase()}-${material}-${materialColor.replace(' ', '_')}`;
        }
        return '';
    };

    const handleInputChange = (field: keyof CreatePieceData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileSelect = (file: File | null) => {
        setSelectedFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl('');
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Aqui você implementaria a lógica de envio para a API
            console.log('Dados do formulário:', formData);
            console.log('Arquivo selecionado:', selectedFile);
            console.log('Status ativo:', isActive);

            // Simular delay de API
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Navegar de volta para o dashboard
            navigate('/');
        } catch (error) {
            console.error('Erro ao criar peça:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscard = () => {
        navigate('/');
    };

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
                                <span className="text-sm text-gray-700 font-medium">Informações não salvas</span>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                                <Button
                                    variant="secondary"
                                    onClick={handleDiscard}
                                    className="w-full sm:w-auto px-4 py-2 text-sm"
                                    disabled={isLoading}
                                >
                                    Descartar
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    isLoading={isLoading}
                                    className="w-full sm:w-auto px-4 py-2 text-sm"
                                >
                                    {isLoading ? 'Salvando...' : 'Salvar'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto px-4 lg:px-6">
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
                                            Modelo {formData.type}
                                        </h1>
                                        <p className="text-sm text-gray-600 truncate">
                                            {formData.title || 'Novo produto'}
                                        </p>
                                    </div>
                                </div>

                                {/* Toggle Ativo/Inativo */}
                                <div className="flex items-center justify-between lg:justify-center gap-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0">
                                    <span className="text-base font-medium text-gray-700">Status:</span>
                                    <div className="flex items-center gap-3">
                                        {/* Texto com largura fixa para evitar movimento */}
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
                                        {/* Nome do Modelo */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <InputField
                                                label="Nome do Modelo"
                                                value={formData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                placeholder="Digite o nome do modelo"
                                            />

                                            <SelectField
                                                label="Tipo do recorte"
                                                value={formData.cutType}
                                                onChange={(e) => handleInputChange('cutType', e.target.value)}
                                                options={CUT_TYPES}
                                            />
                                        </div>

                                        {/* Posição e Ordem */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <SelectField
                                                label="Posição da imagem"
                                                value={formData.position}
                                                onChange={(e) => handleInputChange('position', e.target.value)}
                                                options={POSITIONS}
                                            />

                                            <SelectField
                                                label="Ordem de exibição"
                                                value={formData.displayOrder}
                                                onChange={(e) =>
                                                    handleInputChange('displayOrder', parseInt(e.target.value))
                                                }
                                                options={DISPLAY_ORDERS}
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
                                        <InputField
                                            label="SKU"
                                            value={formData.sku}
                                            onChange={(e) => handleInputChange('sku', e.target.value)}
                                            placeholder="Digite o SKU"
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
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Mídia</h2>

                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    previewUrl={previewUrl}
                                    accept="image/*"
                                    maxSize={5}
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
