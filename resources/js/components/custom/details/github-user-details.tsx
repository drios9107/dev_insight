import {
    GitCommit,
    GitPullRequest,
    Bug,
    CheckSquare,
    Calendar,
    Mail,
    AtSign,
    Github,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomAvatar from '@/components/custom/custom-avatar';
import { Badge } from '@/components/ui/badge';
import { useFetch } from '@/hooks/use-fetch';
import githubUser from '@/routes/github-user';
import type { IGithubUserShow } from '@/types/models/github-user';
import InfoRow from '../info-row';
import { Loader } from '../loader';
import ShadDrawer from '../shad-drawer';
import StatCard from '../stat-card';

interface GithuUserDetailsProps {
    itemId: number;
    onClose: () => void;
}

export function GithubUserDetails({ itemId, onClose }: GithuUserDetailsProps) {
    const [itemToView, setItemToView] = useState<IGithubUserShow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getOne } = useFetch();

    useEffect(() => {
        setIsLoading(true);
        getOne(githubUser.show(itemId).url)
            .then((res) => setItemToView(res?.data))
            .finally(() => setIsLoading(false));
    }, [itemId, getOne]);

    return (
        <ShadDrawer
            title="Developer Details"
            isOpen
            setIsOpen={(open) => !open && onClose()}
        >
            {isLoading || !itemToView ? (
                <div className="relative h-64">
                    <Loader />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* HEADER */}
                    <div className="flex items-center gap-4">
                        <CustomAvatar
                            src={itemToView.avatar ?? undefined}
                            title={itemToView.display_name
                                .charAt(0)
                                .toUpperCase()}
                            className="h-16 w-16"
                            fallbackClassName="text-xl"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {itemToView.display_name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                @{itemToView.username}
                            </p>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            icon={GitCommit}
                            label="Commits"
                            value={itemToView.commits_count ?? 0}
                            color="blue"
                        />
                        <StatCard
                            icon={GitPullRequest}
                            label="Pull Requests"
                            value={itemToView.prs_count ?? 0}
                            color="purple"
                        />
                        <StatCard
                            icon={CheckSquare}
                            label="Reviews"
                            value={itemToView.reviews_count ?? 0}
                            color="green"
                        />
                        <StatCard
                            icon={Bug}
                            label="Issues"
                            value={itemToView.issues_count ?? 0}
                            color="red"
                        />
                    </div>

                    {/* TEAMS */}
                    <div>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Users className="h-4 w-4" /> Teams (
                            {itemToView.teams?.length ?? 0})
                        </h3>
                        {!itemToView.teams || itemToView.teams.length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-400">
                                Not assigned to any team
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {itemToView.teams.map((team) => (
                                    <Badge key={team.id} variant="secondary">
                                        {team.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INFO */}
                    <div className="space-y-3">
                        <InfoRow
                            icon={AtSign}
                            label="Username"
                            value={itemToView.username}
                        />
                        {itemToView.name && (
                            <InfoRow
                                icon={Github}
                                label="Name"
                                value={itemToView.name}
                            />
                        )}
                        {itemToView.email && (
                            <InfoRow
                                icon={Mail}
                                label="Email"
                                value={itemToView.email}
                            />
                        )}
                        {itemToView.github_id && (
                            <InfoRow
                                icon={Github}
                                label="GitHub ID"
                                value={itemToView.github_id}
                            />
                        )}
                        {itemToView.last_synced_at && (
                            <InfoRow
                                icon={Calendar}
                                label="Last Synced"
                                value={itemToView.last_synced_at}
                            />
                        )}
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xs text-gray-400">
                        <div>
                            <span className="font-medium">Created:</span>{' '}
                            {itemToView.created_at}
                        </div>
                    </div>
                </div>
            )}
        </ShadDrawer>
    );
}
