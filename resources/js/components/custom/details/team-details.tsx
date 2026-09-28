import { useEffect, useState } from 'react';
import { ITeamShow } from '@/types/models/team';
import { useFetch } from '@/hooks/use-fetch';
import team from '@/routes/team';
import ShadDrawer from '../shad-drawer';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader } from '../loader';
import { Users, User, Calendar, Shield } from 'lucide-react';
import StatCard from '../stat-card';
import DetailItem from '../detail-item';

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
            {isLoading || !itemToView ? <Loader /> : (
                <div className="space-y-6">
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {itemToView.name}
                        </h2>
                        <Badge variant={itemToView.is_active ? 'success' : 'secondary'}>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </h3>
                            <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                                {itemToView.description}
                            </div>
                        </div>
                    )}

                    {/* DEVELOPERS */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Developers ({itemToView.github_users_count})
                        </h3>
                        {itemToView?.github_users?.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">
                                No developers assigned
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {itemToView.github_users.map((dev) => (
                                    <div
                                        key={dev.id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Avatar className="w-8 h-8 shrink-0">
                                            <AvatarImage src={dev.avatar || undefined} />
                                            <AvatarFallback className="text-xs">
                                                {dev.display_name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {dev.display_name}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                @{dev.username}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-4 border-t">
                        <div>
                            <span className="font-medium">Created:</span> {itemToView.created_at}
                        </div>
                        <div>
                            <span className="font-medium">Updated:</span> {itemToView.updated_at}
                        </div>
                    </div>
                </div>
            )}
        </ShadDrawer>
    );
}