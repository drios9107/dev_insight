import { Users, User, Calendar, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useFetch } from '@/hooks/use-fetch';
import team from '@/routes/team';
import type { ITeamShow } from '@/types/models/team';
import DetailItem from '../detail-item';
import { Loader } from '../loader';
import ShadDrawer from '../shad-drawer';
import StatCard from '../stat-card';

interface TeamDetailsProps {
    itemId: number;
    onClose: () => void;
}

export function TeamDetails({ itemId, onClose }: TeamDetailsProps) {
    const [itemToView, setItemToView] = useState<ITeamShow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getOne } = useFetch();

    useEffect(() => {
        setIsLoading(true);
        getOne(team.show(itemId).url)
            .then((res) => setItemToView(res?.data))
            .finally(() => setIsLoading(false));
    }, [itemId, getOne]);

    return (
        <ShadDrawer
            title="Team Details"
            isOpen
            setIsOpen={(open) => !open && onClose()}
        >
            {isLoading || !itemToView ? (
                <Loader />
            ) : (
                <div className="space-y-6">
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {itemToView.name}
                        </h2>
                        <Badge
                            variant={
                                itemToView.is_active ? 'success' : 'secondary'
                            }
                        >
                            {itemToView.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            icon={Users}
                            label="Developers"
                            value={itemToView.github_users_count}
                            color="blue"
                        />
                        <StatCard
                            icon={Shield}
                            label="Status"
                            value={itemToView.is_active ? 'Active' : 'Inactive'}
                            color={itemToView.is_active ? 'green' : 'gray'}
                        />
                    </div>

                    {/* METADATA */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <DetailItem
                            icon={User}
                            label="Owner"
                            value={itemToView.owner?.name}
                            avatar={itemToView.owner?.avatar_url}
                        />
                        <DetailItem
                            icon={Calendar}
                            label="Created"
                            value={itemToView.created_at}
                        />
                    </div>

                    {/* DESCRIPTION */}
                    {itemToView.description && (
                        <div>
                            <h3 className="mb-2 text-sm font-semibold text-gray-700">
                                Description
                            </h3>
                            <div className="rounded-lg bg-gray-50 p-3 text-sm whitespace-pre-wrap text-gray-600">
                                {itemToView.description}
                            </div>
                        </div>
                    )}

                    {/* DEVELOPERS */}
                    <div>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Users className="h-4 w-4" /> Developers (
                            {itemToView.github_users_count})
                        </h3>
                        {itemToView?.github_users?.length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-400">
                                No developers assigned
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {itemToView.github_users.map((dev) => (
                                    <div
                                        key={dev.id}
                                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                                    >
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage
                                                src={dev.avatar || undefined}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {dev.display_name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {dev.display_name}
                                            </p>
                                            <p className="truncate text-xs text-gray-400">
                                                @{dev.username}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xs text-gray-400">
                        <div>
                            <span className="font-medium">Created:</span>{' '}
                            {itemToView.created_at}
                        </div>
                        <div>
                            <span className="font-medium">Updated:</span>{' '}
                            {itemToView.updated_at}
                        </div>
                    </div>
                </div>
            )}
        </ShadDrawer>
    );
}
