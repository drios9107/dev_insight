import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';
import CustomAvatar from './custom/custom-avatar';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <CustomAvatar
                src={user?.avatar}
                title={getInitials(user.name)}
                alt={user?.name}
                className="h-8 w-8 overflow-hidden rounded-full"
                fallbackClassName="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
