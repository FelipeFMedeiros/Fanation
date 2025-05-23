import { useState } from 'react';
// Contexts
import { useAuth } from '../contexts/AuthContextData';
// Core Components
import Header from '@/components/Header';
// UI Components
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading local do formulário
    const { signIn } = useAuth(); // Removemos isLoading do AuthContext

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Limpar erros anteriores

        if (!password.trim()) {
            setError('Por favor, digite sua senha');
            return;
        }

        setIsSubmitting(true); // Iniciar loading local

        try {
            await signIn(password);
            // Se chegou aqui, login foi bem-sucedido
            // O usuário será redirecionado automaticamente pelo AuthGuard/PrivateRoute
        } catch (err) {
            console.error('Erro no login:', err);

            // Tratar diferentes tipos de erro com mensagens mais específicas
            if (err instanceof Error) {
                // Verificar tipos de erro específicos
                if (err.message.includes('401') || err.message.toLowerCase().includes('senha')) {
                    setError('Senha incorreta. Verifique e tente novamente.');
                } else if (err.message.includes('429')) {
                    setError('Muitas tentativas de login. Aguarde alguns minutos e tente novamente.');
                } else if (err.message.includes('timeout') || err.message.includes('network')) {
                    setError('Problema de conexão. Verifique sua internet e tente novamente.');
                } else {
                    setError(err.message);
                }
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError('Ocorreu um erro inesperado. Tente novamente.');
            }
        } finally {
            setIsSubmitting(false); // Finalizar loading local
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        // Limpar erro quando o usuário começar a digitar
        if (error) {
            setError('');
        }
    };

    return (
        <div className="min-h-screen-mobile bg-white flex flex-col">
            {/* Header - apenas no desktop */}
            <Header variant="login" />

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
                <div className="w-full max-w-md space-y-6 lg:space-y-8">
                    {/* Logo - aparece em todas as telas */}
                    <div className="text-center">
                        <img src="/fanaticon-preta.png" alt="Fanation" className="mx-auto h-16 w-auto" />
                    </div>

                    {/* Card de login */}
                    <div className="space-y-6">
                        {/* Título */}
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#9A0FF1]">Bem-vindo ao Fanation</h2>
                            <p className="mt-2 text-sm text-gray-600">Acesse a sua conta para iniciar</p>
                        </div>

                        {/* Mensagem de erro - SEMPRE VISÍVEL quando há erro */}
                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-md animate-in slide-in-from-top-2 duration-300">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mensagem de sucesso temporária (opcional) */}
                        {isSubmitting && !error && (
                            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md animate-in slide-in-from-top-2 duration-300">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-blue-400 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700 font-medium">Verificando credenciais...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Formulário */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <Input
                                    variant="password"
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    label="Inserir senha"
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isSubmitting}
                                disabled={isSubmitting || !password.trim()}
                            >
                                {isSubmitting ? 'Verificando...' : 'Acessar'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer fixo na parte inferior */}
            <footer className="py-4 mt-auto">
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Desenvolvido pela <span className="font-medium text-gray-600">SeuBonê</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}
