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

    // Fix 1: Use useMemo to prevent selectedSKUs from changing on every render
    const selectedSKUs = useMemo(() => {
        return (location.state?.selectedPieces as string[]) || [];
    }, [location.state?.selectedPieces]);

    const [pieces, setPieces] = useState<Piece[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');

    // Load piece data for the selected SKUs
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

                // Fix 2: Add explicit type for 'sku'
                const piecesData = await Promise.all(
                    selectedSKUs.map((sku: string) => recortesService.getRecorteBySku(sku)),
                );

                // Sort by display order (lower numbers first, to be at the bottom layer)
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

    // Generate the composite image whenever pieces change
    useEffect(() => {
        if (pieces.length === 0) return;

        const canvas = canvasRef.current;
        // Fix 3: Early return if canvas is null
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

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Load all images
                const loadImage = (url: string): Promise<HTMLImageElement> => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                        img.crossOrigin = 'anonymous'; // Allow cross-origin images
                        img.src = url;
                    });
                };

                // Set initial canvas dimensions - we'll use the first image's size
                const firstPiece = pieces.find((p) => p.imageUrl);
                if (!firstPiece?.imageUrl) {
                    throw new Error('No valid images to display');
                }

                const firstImg = await loadImage(firstPiece.imageUrl);
                canvas.width = firstImg.width;
                canvas.height = firstImg.height;

                // Load and layer the images in order
                for (const piece of pieces) {
                    if (piece.imageUrl) {
                        try {
                            const img = await loadImage(piece.imageUrl);
                            // Draw image on canvas
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        } catch (err) {
                            console.error(`Error loading image for piece ${piece.title}:`, err);
                        }
                    }
                }

                // Convert the canvas to a data URL
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

    // Handle reordering of the pieces
    const handleMoveUp = (index: number) => {
        if (index <= 0) return;

        const newPieces = [...pieces];
        const temp = newPieces[index];
        newPieces[index] = newPieces[index - 1];
        newPieces[index - 1] = temp;

        setPieces(newPieces);
    };

    const handleMoveDown = (index: number) => {
        if (index >= pieces.length - 1) return;

        const newPieces = [...pieces];
        const temp = newPieces[index];
        newPieces[index] = newPieces[index + 1];
        newPieces[index + 1] = temp;

        setPieces(newPieces);
    };

    const handleRemovePiece = (pieceId: string) => {
        setPieces(pieces.filter((p) => p.id !== pieceId));
    };

    // Handle download of generated image
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
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <ArrowBack className="w-5 h-5 text-gray-600" />
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
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - Table */}
                                <div className="lg:col-span-1">
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
                                                onMoveUp={handleMoveUp}
                                                onMoveDown={handleMoveDown}
                                                onRemovePiece={handleRemovePiece}
                                            />
                                        </div>

                                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                            <p className="text-xs text-gray-500">
                                                Dica: A camada 1 fica na parte inferior da imagem
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Generated Image */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                            <h2 className="font-semibold text-gray-900">Visualização</h2>
                                            {generatedImageUrl && !isGenerating && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={handleDownload}
                                                    className="text-xs"
                                                >
                                                    <FileDownload fontSize="small" className="mr-1" /> Baixar
                                                </Button>
                                            )}
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
                                                        className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
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

                        {/* Extra spacing for mobile */}
                        <div className="h-20 lg:h-8"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}
