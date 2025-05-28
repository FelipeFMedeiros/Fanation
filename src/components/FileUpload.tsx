import { useState, useRef } from 'react';
import { CloudUpload, Delete } from '@mui/icons-material';
// Ui
import Button from './ui/Button';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    accept?: string;
    maxSize?: number; // em MB
    previewUrl?: string;
    className?: string;
    title?: string;
    subtitle?: string;
}

export default function FileUpload({
    onFileSelect,
    accept = 'image/*',
    maxSize = 5,
    previewUrl,
    className = '',
    title = 'Carregar arquivo',
    subtitle = 'Escolha um arquivo ou arraste e solte aqui',
}: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string>('');
    const [, setDragCounter] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setDragCounter((prev) => prev + 1);

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragActive(true);
        }
    };

    const handleDragOut = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setDragCounter((prev) => {
            const newCounter = prev - 1;

            // Só desativa o drag quando o contador chegar a 0
            if (newCounter === 0) {
                setDragActive(false);
            }

            return newCounter;
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Reset do estado de drag
        setDragActive(false);
        setDragCounter(0);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            handleFiles(files);
        }
    };

    const handleFiles = (files: FileList) => {
        const file = files[0];

        if (!file) return;

        // Validar tipo de arquivo
        if (accept && !file.type.match(accept.replace('*', '.*'))) {
            setError('Tipo de arquivo não suportado');
            return;
        }

        // Validar tamanho
        if (file.size > maxSize * 1024 * 1024) {
            setError(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
            return;
        }

        setError('');
        onFileSelect(file);
    };

    const removeFile = () => {
        onFileSelect(null);
        setError('');
        // Limpar o input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const openFileSelector = () => {
        inputRef.current?.click();
    };

    return (
        <div className={`w-full ${className}`}>
            <div
                className={`
                    border-2 border-dashed rounded-lg p-6 sm:p-8 text-center 
                    transition-all duration-200 cursor-pointer relative
                    ${
                        dragActive
                            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg'
                            : error
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                `}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileSelector}
            >
                {/* Overlay para capturar eventos de drag de forma mais confiável */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                />

                {previewUrl ? (
                    <div className="space-y-4 relative z-10">
                        <div className="relative inline-block">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-h-48 mx-auto rounded-lg object-contain shadow-md"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Arquivo selecionado</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                            >
                                <Delete className="w-4 h-4" />
                                Remover arquivo
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 relative z-10">
                        <CloudUpload
                            className={`w-12 h-12 mx-auto transition-colors duration-200 ${
                                dragActive ? 'text-blue-500' : error ? 'text-red-400' : 'text-gray-400'
                            }`}
                        />
                        <div>
                            <p
                                className={`text-lg font-medium mb-2 transition-colors duration-200 ${
                                    dragActive ? 'text-blue-700' : error ? 'text-red-700' : 'text-gray-900'
                                }`}
                            >
                                {dragActive ? 'Solte o arquivo aqui' : title}
                            </p>
                            <p
                                className={`text-sm mb-4 transition-colors duration-200 ${
                                    dragActive ? 'text-blue-600' : error ? 'text-red-600' : 'text-gray-500'
                                }`}
                            >
                                {dragActive ? 'Solte para fazer upload' : subtitle}
                            </p>
                            <p className="text-xs text-gray-400">
                                Tamanho máximo: {maxSize}MB • Formatos aceitos: {accept}
                            </p>
                        </div>

                        {/* Botão com pointer-events-none para não interferir no drag */}
                        <div className="pointer-events-none">
                            <Button variant="secondary" className="select-none">
                                {dragActive ? 'Solte aqui' : 'Escolher arquivo'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Input file oculto */}
            <input ref={inputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

            {/* Mensagem de erro */}
            {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-1 duration-200">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            !
                        </span>
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}
