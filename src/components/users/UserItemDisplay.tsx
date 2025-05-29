import { User } from '@/types/users';

interface UserItemDisplayProps {
    user: User;
    showDetails?: boolean;
    compact?: boolean;
}

export default function UserItemDisplay({ user, showDetails = true, compact = false }: UserItemDisplayProps) {
    // Gerar avatar com iniciais
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const avatarSize = compact ? 'h-10 w-10' : 'h-12 w-12';

    return (
        <div className="flex items-center">
            <div className={`flex-shrink-0 ${avatarSize} ${compact ? 'mr-3' : ''}`}>
                <div
                    className={`${avatarSize} bg-blue-100 rounded-full flex items-center justify-center border border-blue-200`}
                >
                    <span className="text-blue-600 text-sm font-semibold">{getInitials(user.name)}</span>
                </div>
            </div>
            <div className={compact ? '' : 'ml-4'}>
                <div className="text-sm font-medium text-gray-900 line-clamp-1">{user.name}</div>
                {showDetails && (
                    <div className="text-xs text-gray-500">
                        {compact ? (
                            <>ID: {user.id.substring(0, 8)}...</>
                        ) : (
                            <>
                                <span className="capitalize">{user.role}</span>
                                {user.creatorName && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <span>Criado por {user.creatorName}</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
