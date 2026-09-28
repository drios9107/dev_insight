import {
    GitCommit,
    GitPullRequest,
    Bug,
    CheckSquare,
    Calendar,
    Mail,
    AtSign,
    Github,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFetch } from '@/hooks/use-fetch';
import githubUser from '@/routes/github-user';
import type { IGithubUserShow } from '@/types/models/github-user';
import InfoRow from '../info-row';
import { Loader } from '../loader';
import ShadDrawer from '../shad-drawer';
import StatCard from '../stat-card';

interface GithubUserDetailsProps {
    itemId: number;
    onClose: () => void;
}

export function GithubUserDetails({ itemId, onClose }: GithubUserDetailsProps) {
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
            {isLoading || !itemToView ? <Loader /> : (
                <div className="space-y-6">
                    {/* HEADER */}
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={itemToView.avatar || undefined} />
                            <AvatarFallback className="text-xl">
                                {itemToView.display_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {itemToView.display_name}
                            </h2>
                            <p className="text-sm text-gray-500">@{itemToView.username}</p>
                        </div>
                    </div>

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={GitCommit} label="Commits" value={itemToView.commits_count ?? 0} color="blue" />
                        <StatCard icon={GitPullRequest} label="Pull Requests" value={itemToView.prs_count ?? 0} color="purple" />
                        <StatCard icon={CheckSquare} label="Reviews" value={itemToView.reviews_count ?? 0} color="green" />
                        <StatCard icon={Bug} label="Issues" value={itemToView.issues_count ?? 0} color="red" />
                    </div>

                    {/* INFO */}
                    <div className="space-y-3">
                        <InfoRow icon={AtSign} label="Username" value={itemToView.username} />
                        {itemToView.name && (
                            <InfoRow icon={Github} label="Name" value={itemToView.name} />
                        )}
                        {itemToView.email && (
                            <InfoRow icon={Mail} label="Email" value={itemToView.email} />
                        )}
                        {itemToView.github_id && (
                            <InfoRow icon={Github} label="GitHub ID" value={itemToView.github_id} />
                        )}
                        {itemToView.last_synced_at && (
                            <InfoRow icon={Calendar} label="Last Synced" value={itemToView.last_synced_at} />
                        )}
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-4 border-t">
                        <div><span className="font-medium">Created:</span> {itemToView.created_at}</div>
                    </div>
                </div>
            )}
        </ShadDrawer>
    );
}
