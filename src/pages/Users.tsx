import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { People, PersonAdd, Search } from '@mui/icons-material';
// Components
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import UsersTable from '@/components/users/UsersTable';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import ErrorMessage from '@/components/ui/ErrorMessage';
import InputField from '@/components/ui/InputField';
// Types
import { User } from '@/types/users';
// Services
import { usersService } from '@/services/users';
// Hooks
import { useToast } from '@/contexts/ToastContext';

type UserSortField = 'name' | 'createdAt' | 'role';
type SortOrder = 'asc' | 'desc';

export default function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState<UserSortField>('role');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const { showError } = useToast();

    // Função para carregar usuários
    const loadUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await usersService.getUsers({
                page: currentPage,
                limit: 10,
                search: searchTerm || undefined,
                sortBy,
                sortOrder,
            });

            setUsers(result.users);
            setTotalPages(result.totalPages);
            setTotal(result.total);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários';
            setError(errorMessage);
            showError('Erro ao carregar usuários', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Carregar usuários quando a página carrega ou parâmetros mudam
    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchTerm, sortBy, sortOrder]);

    // Handlers
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = (newSortBy: UserSortField, newSortOrder: SortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1);
    };

    const handleEditClick = (user: User) => {
        navigate(`/usuarios/editar/${user.id}`);
    };

    const handleDeleteSuccess = () => {
        loadUsers();
    };

    const handleCreateUser = () => {
        navigate('/usuarios/criar');
    };

    return (
        <PageLayout>
            {/* Page Header */}
            <PageHeader
                title="Gerenciamento de Usuários"
                subtitle="Gerencie todos os usuários do sistema"
                actions={
                    <Button variant="primary" className="w-full lg:w-auto" onClick={handleCreateUser}>
                        <PersonAdd className="w-4 h-4 mr-2" />
                        Adicionar usuário
                    </Button>
                }
            />

            {/* Search Bar */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <InputField
                            placeholder="Buscar usuários por nome..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>
                </div>
            </div>

            {/* Search Results Info */}
            {searchTerm && !isLoading && !error && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-sm text-blue-800">
                            <Search className="w-4 h-4" />
                            <span>
                                {total === 0
                                    ? 'Nenhum resultado encontrado'
                                    : `${total} resultado${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
                                {searchTerm && ` para "${searchTerm}"`}
                            </span>
                        </div>
                        <button
                            onClick={() => handleSearch('')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Limpar busca
                        </button>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && <ErrorMessage message={error} onRetry={loadUsers} />}

            {/* Loading State */}
            {isLoading && <LoadingIndicator message="Carregando usuários..." />}

            {/* Table Container */}
            {!isLoading && !error && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {users.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <People className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? 'Nenhum usuário encontrado com os termos de busca.'
                                    : 'Nenhum usuário cadastrado.'}
                            </p>
                            {searchTerm ? (
                                <div className="flex gap-2 justify-center">
                                    <Button variant="secondary" onClick={() => handleSearch('')}>
                                        Limpar busca
                                    </Button>
                                    <Button variant="primary" onClick={handleCreateUser}>
                                        <PersonAdd className="w-4 h-4 mr-2" />
                                        Adicionar usuário
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="primary" onClick={handleCreateUser}>
                                    <PersonAdd className="w-4 h-4 mr-2" />
                                    Adicionar primeiro usuário
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <UsersTable
                                users={users}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                onDeleteSuccess={handleDeleteSuccess}
                                onEditClick={handleEditClick}
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSortChange={handleSortChange}
                            />
                        </div>
                    )}
                </div>
            )}
        </PageLayout>
    );
}
