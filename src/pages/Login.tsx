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
    const { signIn, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password.trim()) {
            setError('Por favor, digite sua senha');
            return;
        }

        try {
            await signIn(password);
        } catch (err) {
            setError('Senha incorreta. Tente novamente.');
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen-mobile bg-white flex flex-col">
            {/* Header - apenas no desktop */}
            <Header variant='login' />

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

                        {/* Formulário */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <Input
                                    variant="password"
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={error}
                                    label="Inserir senha"
                                />
                            </div>

                            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                                Acessar
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
