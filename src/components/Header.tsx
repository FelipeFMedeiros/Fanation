// Contexts
import { useAuth } from '../contexts/AuthContextData';
// UI Components
import Button from '@/components/ui/Button';

interface HeaderProps {
    variant?: 'login' | 'primary' | 'secondary';
}

export default function Header({ variant = 'primary' }: HeaderProps) {
    const { user, signOut } = useAuth();

    if (variant === 'login') {
        return (
            <header className="hidden lg:block bg-[#440986] py-4">
                <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <a href="/" className="flex items-center w-fit h-8">
                        <img src="/fanaticon-branca-full.png" alt="Fanation" className="h-8 w-auto" />
                    </a>
                </div>
            </header>
        );
    }

    if (variant === 'secondary') {
        return (
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <a href="/" className="flex items-center w-fit h-8">
                            <img src="/fanaticon-preta.png" alt="Fanation" className="h-8 w-auto" />
                        </a>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Olá, {user?.name || 'Usuário'}!</span>
                            <Button onClick={signOut} variant="secondary" size="sm">
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="hidden lg:block bg-[#440986] py-4">
            <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <a href="/" className="flex items-center w-fit h-8">
                        <img src="/fanaticon-branca-full.png" alt="Fanation" className="h-8 w-auto" />
                    </a>
                    <div className="flex items-center space-x-4">
                        <span className="text-white">Olá, {user?.name || 'Usuário'}!</span>
                        <Button onClick={signOut} variant="purple" size="sm">
                            Sair
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
