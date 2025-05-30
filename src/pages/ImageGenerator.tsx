import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowBack, FileDownload, InfoOutlined } from '@mui/icons-material';
// Components
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import LayeredPiecesTable from '@/components/LayeredPiecesTable';
// Types
import { Piece } from '@/types/pieces';
// Services
import { recortesService } from '@/services/recortes';

export default function ImageGenerator() {
    const navigate = useNavigate();
    const location = useLocation();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const selectedSKUs = useMemo(() => {
        return (location.state?.selectedPieces as string[]) || [];
    }, [location.state?.selectedPieces]);

    const [pieces, setPieces] = useState<Piece[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');

    // Carrega as peças selecionadas ao montar o componente
    useEffect(() => {
        const loadPieces = async () => {
            setIsLoading(true);
            setError('');

            try {
                if (selectedSKUs.length === 0) {
                    setError('Nenhuma peça selecionada para visualização.');
                    setIsLoading(false);
                    return;
                }

                const piecesData = await Promise.all(
                    selectedSKUs.map((sku: string) => recortesService.getRecorteBySku(sku)),
                );

                // Organiza as peças por ordem de exibição
                piecesData.sort((a, b) => a.displayOrder - b.displayOrder);
                setPieces(piecesData);
            } catch (err) {
                console.error('Failed to load pieces:', err);
                setError('Erro ao carregar informações das peças selecionadas.');
            } finally {
                setIsLoading(false);
            }
        };

        loadPieces();
    }, [selectedSKUs]);

    // Gera a imagem composta quando as peças são carregadas
    useEffect(() => {
        if (pieces.length === 0) return;

        const canvas = canvasRef.current;

        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        const generateImage = async () => {
            setIsGenerating(true);

            try {
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    throw new Error('Could not get canvas context');
                }

                // Clear no canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Carrega as imagens de cada peça
                const loadImage = (url: string): Promise<HTMLImageElement> => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                        img.crossOrigin = 'anonymous'; // Allow cross-origin images
                        img.src = url;
                    });
                };

                // Seta as dimensões do canvas com a primeira imagem válida
                const firstPiece = pieces.find((p) => p.imageUrl);
                if (!firstPiece?.imageUrl) {
                    throw new Error('No valid images to display');
                }

                const firstImg = await loadImage(firstPiece.imageUrl);
                canvas.width = firstImg.width;
                canvas.height = firstImg.height;

                // Carrega e desenha cada imagem no canvas
                for (const piece of pieces) {
                    // Verifica se a peça possui uma URL de imagem
                    if (piece.imageUrl) {
                        try {
                            // Carrega a imagem da peça de forma assíncrona
                            const img = await loadImage(piece.imageUrl);
                            // Desenha a imagem no canvas, ocupando toda a área do canvas
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        } catch (err) {
                            // Em caso de erro ao carregar a imagem, exibe no console
                            console.error(`Error loading image for piece ${piece.title}:`, err);
                        }
                    }
                }

                // Converte o canvas para uma URL de dados
                const dataUrl = canvas.toDataURL('image/png');
                setGeneratedImageUrl(dataUrl);
            } catch (err) {
                console.error('Error generating composite image:', err);
                setError('Erro ao gerar a imagem composta.');
            } finally {
                setIsGenerating(false);
            }
        };

        generateImage();
    }, [pieces]);

    // Funções para manipular a ordem das peças
    const handleReorder = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;

        const newPieces = [...pieces];
        const [movedPiece] = newPieces.splice(fromIndex, 1);
        newPieces.splice(toIndex, 0, movedPiece);

        setPieces(newPieces);
    };

    const handleRemovePiece = (pieceId: string) => {
        setPieces(pieces.filter((p) => p.id !== pieceId));
    };

    // Função para baixar a imagem gerada
    const handleDownload = () => {
        if (!generatedImageUrl) return;

        const link = document.createElement('a');
        link.download = `fanation-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = generatedImageUrl;
        link.click();
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
                    {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-8 pt-16 lg:pt-8">
                        {/* Page Header */}
                        <div className="flex flex-col gap-4 mb-6 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/visualizacao')}
                                    className="group p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                                    type="button"
                                >
                                    <ArrowBack className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors duration-200" />
                                </button>
                                <div>
                                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                                        Visualização de Imagem
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {pieces.length > 0
                                            ? `${pieces.length} ${
                                                  pieces.length === 1 ? 'peça selecionada' : 'peças selecionadas'
                                              }`
                                            : 'Peças sobrepostas em camadas'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => navigate('/visualizacao')}
                                    className="w-full lg:w-auto"
                                >
                                    Voltar à seleção
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleDownload}
                                    disabled={!generatedImageUrl || isGenerating}
                                    className="w-full lg:w-auto"
                                >
                                    <FileDownload className="mr-1" />
                                    Baixar Imagem
                                </Button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-800 text-sm">{error}</p>
                                <Button variant="secondary" onClick={() => navigate('/visualizacao')} className="mt-2">
                                    Voltar para seleção
                                </Button>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                <p className="text-gray-600">Carregando peças selecionadas...</p>
                            </div>
                        )}

                        {!isLoading && !error && (
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                {/* Left Column - Table */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                            <h2 className="font-semibold text-gray-900">Camadas</h2>
                                            <p className="text-xs text-gray-500 mt-1">
                                                A ordem das camadas afeta a visualização
                                            </p>
                                        </div>

                                        <div className="p-0">
                                            <LayeredPiecesTable
                                                pieces={pieces}
                                                onReorder={handleReorder}
                                                onRemovePiece={handleRemovePiece}
                                            />
                                        </div>

                                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col gap-2">
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <InfoOutlined fontSize="small" className="text-blue-400" />
                                                Arraste as peças para alterar a ordem das camadas.
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <InfoOutlined fontSize="small" className="text-blue-400" />A camada 1
                                                fica na base da imagem, as superiores sobrepõem as inferiores.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Generated Image */}
                                <div className="lg:col-span-3">
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                            <h2 className="font-semibold text-gray-900">Visualização</h2>
                                        </div>

                                        <div className="p-6 flex items-center justify-center">
                                            {isGenerating ? (
                                                <div className="flex flex-col items-center justify-center py-12">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4"></div>
                                                    <p className="text-gray-600">Gerando visualização...</p>
                                                </div>
                                            ) : generatedImageUrl ? (
                                                <div className="flex justify-center">
                                                    <img
                                                        src={generatedImageUrl}
                                                        alt="Imagem gerada"
                                                        className="max-w-full h-auto rounded-lg"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <InfoOutlined className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-600">
                                                        Nenhuma visualização gerada.
                                                        <br />
                                                        Adicione peças para ver a composição.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Hidden canvas for image composition */}
                                            <canvas ref={canvasRef} className="hidden" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Espaçamento para o mobile */}
                        <div className="h-20 lg:h-8"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}
