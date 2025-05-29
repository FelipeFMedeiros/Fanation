import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, PersonAdd, Edit, InfoOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
// Components
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import RoleBadge from '@/components/users/RoleBadge';
import UserItemDisplay from '@/components/users/UserItemDisplay';
// Types
import { User, CreateUserData, UpdateUserData } from '@/types/users';
// Services
import { usersService } from '@/services/users';
// Hooks
import { useToast } from '@/contexts/ToastContext';

export default function UserForm() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const isEditMode = Boolean(userId);
    const { showSuccess, showError } = useToast();

    const [originalUser, setOriginalUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<CreateUserData & { userId?: string }>({
        name: '',
        password: '',
        description: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(isEditMode);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Carregar dados do usuário para edição
    useEffect(() => {
        if (isEditMode && userId) {
            loadUserData(userId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, userId]);

    const loadUserData = async (userIdToLoad: string) => {
        setIsLoadingData(true);
        try {
            // Como não temos um endpoint específico para buscar um usuário por ID,
            // vamos buscar todos e filtrar pelo ID
            const result = await usersService.getUsers();
            const user = result.users.find((u) => u.id === userIdToLoad);

            if (!user) {
                showError('Usuário não encontrado', 'O usuário solicitado não foi encontrado.');
                navigate('/usuarios');
                return;
            }

            setOriginalUser(user);
            setFormData({
                name: user.name,
                description: user.description || '',
                password: '', // Não preenchemos a senha na edição
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar usuário';
            showError('Erro ao carregar usuário', errorMessage);
            navigate('/usuarios');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleInputChange = (field: keyof CreateUserData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Limpar erro do campo quando o usuário começar a digitar
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        }

        // Senha só é obrigatória na criação
        if (!isEditMode) {
            if (!formData.password.trim()) {
                newErrors.password = 'Senha é obrigatória';
            } else if (formData.password.length < 4) {
                newErrors.password = 'Senha deve ter pelo menos 4 caracteres';
            }
        } else if (formData.password && formData.password.length < 4) {
            // Se preencheu senha na edição, deve ter pelo menos 4 caracteres
            newErrors.password = 'Senha deve ter pelo menos 4 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const hasChanges = (): boolean => {
        if (!originalUser) return true; // Se está criando, sempre tem "mudanças"

        return (
            formData.name !== originalUser.name ||
            formData.description !== (originalUser.description || '') ||
            (!!formData.password && formData.password.trim() !== '')
        );
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (isEditMode && !hasChanges()) {
            showError('Nenhuma alteração detectada', 'Modifique pelo menos um campo para salvar.');
            return;
        }

        setIsLoading(true);
        try {
            if (isEditMode && originalUser) {
                // Atualizar usuário existente
                const updateData: UpdateUserData = {
                    userId: originalUser.id,
                    name: formData.name,
                    description: formData.description || undefined,
                };

                await usersService.updateUser(updateData);
                showSuccess(
                    'Usuário atualizado com sucesso',
                    `As informações de "${formData.name}" foram atualizadas.`,
                );
            } else {
                // Criar novo usuário
                const createData: CreateUserData = {
                    name: formData.name,
                    password: formData.password,
                    description: formData.description,
                };

                const userId = await usersService.createUser(createData);
                showSuccess('Usuário criado com sucesso', `O usuário "${formData.name}" foi criado com ID: ${userId}`);
            }

            navigate('/usuarios');
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : `Erro ao ${isEditMode ? 'atualizar' : 'criar'} usuário`;
            showError(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} usuário`, errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscard = () => {
        navigate('/usuarios');
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
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
                            <p className="text-gray-600">Carregando dados do usuário...</p>
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
                                    {isEditMode ? 'Editando usuário' : 'Informações não salvas'}
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
                                    disabled={isEditMode && !hasChanges()}
                                >
                                    {isLoading
                                        ? isEditMode
                                            ? 'Atualizando...'
                                            : 'Criando...'
                                        : isEditMode
                                        ? 'Atualizar usuário'
                                        : 'Criar usuário'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto px-4 lg:px-6">
                        {/* Seção de informações do usuário */}
                        <div className="rounded-lg p-4 lg:p-6 mb-6 lg:mb-8">
                            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                                {/* Informações do usuário */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <button
                                        onClick={() => navigate('/usuarios')}
                                        className="group p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                                        type="button"
                                    >
                                        <ArrowBack className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors duration-200" />
                                    </button>
                                    <div className="min-w-0 flex-1">
                                        <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate">
                                            {isEditMode ? `Editar: ${formData.name || 'Usuário'}` : 'Novo Usuário'}
                                        </h1>
                                        <p className="text-sm text-gray-600 truncate">
                                            {isEditMode && originalUser?.createdAt
                                                ? `Criado em: ${formatDate(originalUser.createdAt)}`
                                                : 'Preencha as informações do novo usuário'}
                                        </p>
                                    </div>
                                </div>

                                {/* Info do usuário atual (apenas na edição) */}
                                {isEditMode && originalUser && (
                                    <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0">
                                        <UserItemDisplay user={originalUser} compact />
                                        <RoleBadge role={originalUser.role} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Formulário Principal */}
                        <div className="space-y-6 lg:space-y-8">
                            {/* Informações do usuário */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        {isEditMode ? (
                                            <Edit className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <PersonAdd className="w-5 h-5 text-blue-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {isEditMode ? 'Editar Informações' : 'Informações do Usuário'}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {isEditMode
                                                ? 'Modifique as informações do usuário'
                                                : 'Preencha as informações do novo usuário'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Nome */}
                                    <div>
                                        <InputField
                                            label="Nome do usuário *"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            error={errors.name}
                                            placeholder="Digite o nome completo"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Senha */}
                                    {!isEditMode && (
                                        <div>
                                            <InputField
                                                label="Senha *"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                error={errors.password}
                                                placeholder="Digite a senha (mínimo 4 caracteres)"
                                                disabled={isLoading}
                                                rightIcon={
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff className="w-4 h-4 text-gray-500" />
                                                        ) : (
                                                            <Visibility className="w-4 h-4 text-gray-500" />
                                                        )}
                                                    </button>
                                                }
                                            />
                                        </div>
                                    )}

                                    {/* Descrição */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descrição (opcional)
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Descrição ou observações sobre o usuário..."
                                            disabled={isLoading}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informações adicionais na edição */}
                            {isEditMode && originalUser && (
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações do Sistema</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ID do Usuário
                                            </label>
                                            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 text-sm font-mono">
                                                {originalUser.id}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Função
                                            </label>
                                            <div className="flex items-center">
                                                <RoleBadge role={originalUser.role} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Data de Criação
                                            </label>
                                            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 text-sm">
                                                {formatDate(originalUser.createdAt)}
                                            </div>
                                        </div>

                                        {originalUser.creatorName && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Criado por
                                                </label>
                                                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 text-sm">
                                                    {originalUser.creatorName}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Espaçamento extra para mobile */}
                        <div className="h-4 lg:h-0"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}
