import { Calendar, FolderKanban, TrendingUp, Award, Target, ListCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { SprintStatusEnum } from '@/enums/sprint';
import { useFetch } from '@/hooks/use-fetch';
import sprint from '@/routes/sprint';
import type { ISprintShow, TSprintStatus } from '@/types/models/sprint';
import DetailItem from '../detail-item';
import { Loader } from '../loader';
import ShadDrawer from '../shad-drawer';
import TaskStat from '../task-stat';

interface SprintDetailsProps {
    itemId: number;
    onClose: () => void;
}

const getSprintStatusColor = (status: TSprintStatus) => {
    const mapping = {
        planning: 'warning',
        active: 'info',
        completed: 'success',
        cancelled: 'destructive',
    };

    return mapping[status] as 'warning' | 'info' | 'success' | 'destructive';
};

export function SprintDetails({ itemId, onClose }: SprintDetailsProps) {
    const [itemToView, setItemToView] = useState<ISprintShow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getOne } = useFetch();

    useEffect(() => {
        setIsLoading(true);
        getOne(sprint.show(itemId).url)
            .then((res) => setItemToView(res?.data))
            .finally(() => setIsLoading(false));
    }, [itemId, getOne]);

    return (
        <ShadDrawer
            title="Sprint Details"
            isOpen
            setIsOpen={(open) => !open && onClose()}
        >
            {isLoading || !itemToView ? <Loader /> : (
                <div className="space-y-6">
                    {/* HEADER */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {itemToView.name}
                        </h2>
                        <Badge variant={getSprintStatusColor(itemToView.status)}>
                            {SprintStatusEnum[itemToView.status]}
                        </Badge>
                    </div>

                    {/* METADATA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem icon={FolderKanban} label="Project" value={itemToView.project?.name} />
                        <DetailItem icon={Calendar} label="Start Date" value={itemToView.start_date} />
                        <DetailItem icon={Calendar} label="End Date" value={itemToView.end_date} />
                        <DetailItem icon={TrendingUp} label="Planned Velocity" value={itemToView.velocity} />
                        <DetailItem icon={Award} label="Actual Velocity" value={itemToView.actual_velocity} />
                    </div>

                    {/* GOAL */}
                    {itemToView.goal && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" /> Sprint Goal
                            </h3>
                            <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                                {itemToView.goal}
                            </div>
                        </div>
                    )}

                    {/* TASKS SUMMARY */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <ListCheck className="w-4 h-4" /> Tasks Summary
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <TaskStat label="Backlog" value={itemToView.tasks_by_status?.backlog ?? 0} color="gray" />
                            <TaskStat label="To Do" value={itemToView.tasks_by_status?.todo ?? 0} color="blue" />
                            <TaskStat label="In Progress" value={itemToView.tasks_by_status?.in_progress ?? 0} color="yellow" />
                            <TaskStat label="Review" value={itemToView.tasks_by_status?.review ?? 0} color="purple" />
                            <TaskStat label="Done" value={itemToView.tasks_by_status?.done ?? 0} color="green" />
                        </div>
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-4 border-t">
                        <div><span className="font-medium">Created:</span> {itemToView.created_at}</div>
                        <div><span className="font-medium">Updated:</span> {itemToView.updated_at}</div>
                    </div>
                </div>
            )}
        </ShadDrawer>
    );
}
