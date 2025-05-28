import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ViewInAr, PersonAddAlt, Extension, Menu, Close } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContextData';

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    isActive?: boolean;
}

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut } = useAuth();

    // Determinar item ativo baseado na rota atual
    const getActiveItem = (pathname: string) => {
        if (pathname === '/' || pathname === '/dashboard') return 'pecas';
        if (pathname.startsWith('/criar') || pathname.startsWith('/editar')) return 'pecas';
        if (pathname.startsWith('/visualizacao')) return 'visualizacao';
        if (pathname === '/usuarios') return 'usuarios';
        return 'pecas'; // default
    };

    const [activeItem, setActiveItem] = useState(getActiveItem(location.pathname));

    // Atualizar item ativo quando a rota mudar
    useEffect(() => {
        const newActiveItem = getActiveItem(location.pathname);
        setActiveItem(newActiveItem);
    }, [location.pathname]);

    const sidebarItems: SidebarItem[] = [
        {
            id: 'pecas',
            label: 'Peças',
            icon: <Extension className="w-5 h-5" />,
            path: '/',
            isActive: activeItem === 'pecas',
        },
        {
            id: 'visualizacao',
            label: 'Visualização',
            icon: <ViewInAr className="w-5 h-5" />,
            path: '/visualizacao',
            isActive: activeItem === 'visualizacao',
        },
        {
            id: 'usuarios',
            label: 'Usuarios',
            icon: <PersonAddAlt className="w-5 h-5" />,
            path: '/usuarios',
            isActive: activeItem === 'usuarios',
        },
    ];

    // Controla o scroll do body quando sidebar está aberta no mobile
    useEffect(() => {
        if (isOpen) {
            // Disable scroll quando sidebar abre
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scroll quando sidebar fecha
            document.body.style.overflow = 'unset';
        }

        // Cleanup: garante que o scroll seja restaurado quando componente desmonta
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Fecha sidebar quando redimensiona para desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    const handleItemClick = (item: SidebarItem) => {
        // Navegar para a rota
        navigate(item.path);

        // Fechar sidebar no mobile após seleção
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleOverlayClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Botão Hamburguer - Apenas Mobile */}
            {!isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#440986] text-white rounded-lg shadow-lg hover:bg-[#9A0FF1] transition-colors duration-200"
                    aria-label="Abrir menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}

            {/* Overlay - Apenas Mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm cursor-pointer"
                    onClick={handleOverlayClick}
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(2px)',
                    }}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed lg:relative inset-y-0 left-0 z-40
                    w-64 bg-gray-100 min-h-screen flex flex-col shadow-lg shadow-gray-400
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo - Mobile */}
                <div className="p-6 border-b border-purple-400/20 block lg:hidden">
                    <div className="flex items-center justify-between">
                        <img src="/fanaticon-preta.png" alt="Fanation" className="h-8 w-auto" />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-md text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:cursor-pointer"
                        >
                            <Close className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {sidebarItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleItemClick(item)}
                                    className={`
                                        w-full flex items-center px-4 py-3 text-left rounded-3xl
                                        transition-all duration-200 ease-in-out hover:cursor-pointer
                                        ${
                                            item.isActive
                                                ? 'bg-[#440986] text-white shadow-lg transform scale-[1.02]'
                                                : 'text-gray-900 hover:bg-gray-300 hover:text-black hover:transform hover:scale-[1.01]'
                                        }
                                    `}
                                    title={`Ir para ${item.label}`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer - Informações do usuário no mobile */}
                <div className="p-4 border-t border-gray-300 lg:hidden">
                    {/* Exibe as informações do usuário */}
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-[#440986] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="w-full mt-2 px-4 py-2 rounded-2xl bg-[#440986] text-white font-medium shadow hover:bg-[#9A0FF1] transition-colors duration-200 hover:cursor-pointer"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </>
    );
}
