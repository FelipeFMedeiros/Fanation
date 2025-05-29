import { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
// Components
import SortableHeader, { SortField, SortOrder } from '../table/SortableHeader';
import TablePagination from '../table/TablePagination';
import UserItemDisplay from './UserItemDisplay';
import RoleBadge from './RoleBadge';
import ConfirmationModal from '../ui/ConfirmationModal';
// Types
import { User } from '@/types/users';
// Services
import { usersService } from '@/services/users';
// Hooks
import { useToast } from '@/contexts/ToastContext';

type UserSortField = 'name' | 'createdAt' | 'role';

interface UsersTableProps {
    users: User[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onDeleteSuccess?: () => void;
    onEditClick?: (user: User) => void;
    sortBy: UserSortField;
    sortOrder: SortOrder;
    onSortChange: (sortBy: UserSortField, sortOrder: SortOrder) => void;
}

export default function UsersTable({
    users,
    currentPage,
    totalPages,
    onPageChange,
    onDeleteSuccess,
    onEditClick,
    sortBy,
    sortOrder,
    onSortChange,
}: UsersTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
    const { showSuccess, showError } = useToast();

    const handleEditClick = (user: User) => {
        onEditClick?.(user);
    };

    const handleDeleteClick = (id: string, name: string) => {
        setUserToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        setDeletingId(userToDelete.id);
        try {
            await usersService.deleteUser(userToDelete.id);
            showSuccess('Usuário excluído', `O usuário "${userToDelete.name}" foi excluído com sucesso.`);
            onDeleteSuccess?.();
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao excluir usuário';
            showError('Erro ao excluir usuário', errorMessage);
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteCancel = () => {
        if (deletingId) return;
        setShowDeleteModal(false);
        setUserToDelete(null);
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

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader
                                label="Usuário"
                                sortKey="nome"
                                currentSortBy={sortBy as SortField}
                                currentSortOrder={sortOrder}
                                onSort={(field, order) => onSortChange(field as UserSortField, order)}
                            />
                            <SortableHeader
                                label="Função"
                                sortKey="role"
                                currentSortBy={sortBy as SortField}
                                currentSortOrder={sortOrder}
                                onSort={(field, order) => onSortChange(field as UserSortField, order)}
                            />
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição
                            </th>
                            <SortableHeader
                                label="Criado em"
                                sortKey="createdAt"
                                currentSortBy={sortBy as SortField}
                                currentSortOrder={sortOrder}
                                onSort={(field, order) => onSortChange(field as UserSortField, order)}
                            />
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <tr
                                key={user.id}
                                className={`
                                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                                    transition-all duration-200 
                                    hover:bg-blue-50 hover:shadow-sm
                                    group
                                `}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <UserItemDisplay user={user} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                        {user.description || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105 opacity-80 group-hover:opacity-100 hover:cursor-pointer"
                                            title="Editar usuário"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user.id, user.name)}
                                            disabled={deletingId === user.id}
                                            className={`p-2 rounded-lg transition-all duration-200 opacity-80 group-hover:opacity-100 ${
                                                deletingId === user.id
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-600 hover:text-red-900 hover:bg-red-50 hover:scale-105 hover:cursor-pointer'
                                            }`}
                                            title="Excluir usuário"
                                        >
                                            {deletingId === user.id ? (
                                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                            ) : (
                                                <Delete className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Excluir Usuário"
                message={`Tem certeza que deseja excluir o usuário "${userToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                isLoading={!!deletingId}
                variant="danger"
            />
        </div>
    );
}
