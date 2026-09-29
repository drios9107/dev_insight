import {
    Users,
    ListCheck,
    Calendar,
    User,
    Github,
    ListStart,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ProjectStatusEnum } from '@/enums/project';
import { useFetch } from '@/hooks/use-fetch';
import project from '@/routes/project';
import type { IProjectShow, TProjectStatus } from '@/types/models/project';
import DetailItem from '../detail-item';
import { Loader } from '../loader';
import ShadDrawer from '../shad-drawer';
import StatCard from '../stat-card';

interface ProjectDetailsProps {
    itemId: number;
    onClose: () => void;
}

const getProjectStatusColor = (status: TProjectStatus) => {
    const mapping = {
        planning: 'warning',
        active: 'info',
        paused: 'destructive',
        completed: 'success',
        archived: 'secondary',
    };

    return mapping[status] as
        'warning' | 'info' | 'destructive' | 'success' | 'secondary';
};

export function ProjectDetails({ itemId, onClose }: ProjectDetailsProps) {
    const [itemToView, setItemToView] = useState<IProjectShow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getOne } = useFetch();

    useEffect(() => {
        setIsLoading(true);
        getOne(project.show(itemId).url)
            .then((res) => setItemToView(res?.data))
            .finally(() => setIsLoading(false));
    }, [itemId, getOne]);

    return (
        <ShadDrawer
            title="Project Details"
            isOpen
            setIsOpen={(open) => !open && onClose()}
        >
            {isLoading || !itemToView ? (
                <Loader />
            ) : (
                <div className="space-y-6">
                    {/* HEADER */}
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-gray-900">
                            {itemToView.name}
                        </h2>
                        <Badge
                            variant={getProjectStatusColor(itemToView.status)}
                        >
                            {ProjectStatusEnum[itemToView.status]}
                        </Badge>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-3">
                        <StatCard
                            icon={Users}
                            label="Developers"
                            value={itemToView.github_users_count ?? 0}
                            color="blue"
                        />
                        <StatCard
                            icon={ListCheck}
                            label="Tasks"
                            value={itemToView.tasks_count ?? 0}
                            color="green"
                        />
                        <StatCard
                            icon={ListStart}
                            label="Sprints"
                            value={itemToView.sprints_count ?? 0}
                            color="purple"
                        />
                    </div>

                    {/* PROGRESS */}
                    {itemToView.progress !== undefined && (
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Progress
                                </h3>
                                <span className="text-sm font-medium text-gray-900">
                                    {itemToView.progress}%
                                </span>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                                    style={{ width: `${itemToView.progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* METADATA */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <DetailItem
                            icon={Users}
                            label="Team"
                            value={itemToView.team?.name}
                        />
                        <DetailItem
                            icon={User}
                            label="Owner"
                            value={itemToView.owner?.name}
                            avatar={itemToView.owner?.avatar_url}
                        />
                        <DetailItem
                            icon={Calendar}
                            label="Start Date"
                            value={itemToView.start_date}
                        />
                        <DetailItem
                            icon={Calendar}
                            label="End Date"
                            value={itemToView.end_date}
                        />
                        {itemToView.github_repository && (
                            <DetailItem
                                icon={Github}
                                label="Repository"
                                value={itemToView.github_repository.full_name}
                            />
                        )}
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
