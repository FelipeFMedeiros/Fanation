interface RoleBadgeProps {
    role: string;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'user':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'moderator':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border capitalize ${getRoleColor(
                role,
            )}`}
        >
            {role}
        </span>
    );
}
