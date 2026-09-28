import { useEffect, useState } from 'react';
import { ITaskShow } from '@/types/models/task';
import { useFetch } from '@/hooks/use-fetch';
import task from '@/routes/task';
import ShadDrawer from '../shad-drawer';
import { Badge } from '@/components/ui/badge';
import { TaskPriorityEnum, TaskStatusEnum } from '@/enums/task';
import { Clock, User, FolderKanban, ListStart, Calendar, Award, TrendingUp, Bug } from 'lucide-react';
import { getTaskPriorityColor, getTaskStatusColor } from '@/lib/utils/task';
import DetailItem from '../detail-item';
import { TaskComments } from '../forms/task-comment';
import { Loader } from '../loader';

interface TaskDetailsProps {
    itemId: number;
    onClose: () => void;
}

export function TaskDetails({ itemId, onClose }: TaskDetailsProps) {
    const [itemToView, setItemToView] = useState<ITaskShow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getOne } = useFetch();

    useEffect(() => {
        setIsLoading(true);
        getOne(task.show(itemId).url)
            .then((res) => setItemToView(res?.data))
            .finally(() => setIsLoading(false));
    }, [itemId, getOne]);

    return (
        <ShadDrawer
            title="Task Details"
            isOpen
            setIsOpen={(open) => !open && onClose()}
        >
            {isLoading || !itemToView ? <Loader /> : (
                <div className="space-y-6">
                    {/* HEADER */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {itemToView.title}
                        </h2>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={getTaskStatusColor(itemToView.status)}>
                                {TaskStatusEnum[itemToView.status]}
                            </Badge>
                            <Badge variant={getTaskPriorityColor(itemToView.priority)}>
                                {TaskPriorityEnum[itemToView.priority]}
                            </Badge>
                        </div>
                    </div>

                    {/* METADATA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem icon={FolderKanban} label="Project" value={itemToView.project?.name} />
                        <DetailItem icon={ListStart} label="Sprint" value={itemToView.sprint?.name} />
                        <DetailItem
                            icon={User}
                            label="Assignee"
                            value={itemToView.assignee?.display_name}
                            avatar={itemToView.assignee?.avatar}
                        />
                        <DetailItem
                            icon={User}
                            label="Reporter"
                            value={itemToView.reporter?.name}
                            avatar={itemToView.reporter?.avatar_url}
                        />
                        <DetailItem icon={Calendar} label="Due Date" value={itemToView.due_date} />
                        <DetailItem icon={Clock} label="Hours Estimate" value={itemToView.hours_estimate ? `${itemToView.hours_estimate}h` : null} />
                        <DetailItem icon={Clock} label="Hours Spent" value={itemToView.hours_spent ? `${itemToView.hours_spent}h` : null} />
                        <DetailItem icon={Award} label="Story Points" value={itemToView.story_points} />
                        <DetailItem icon={TrendingUp} label="Order" value={itemToView.order} />
                        {itemToView.github_issue && (
                            <DetailItem
                                icon={Bug}
                                label="GitHub Issue"
                                value={`#${itemToView.github_issue.number} - ${itemToView.github_issue.title}`}
                            />
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    {itemToView.description && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                            <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                                {itemToView.description}
                            </div>
                        </div>
                    )}

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-4 border-t">
                        <div><span className="font-medium">Created:</span> {itemToView.created_at}</div>
                        <div><span className="font-medium">Updated:</span> {itemToView.updated_at}</div>
                        {itemToView.completed_at && (
                            <div><span className="font-medium">Completed:</span> {itemToView.completed_at}</div>
                        )}
                    </div>

                    {/* COMMENTS */}
                    <TaskComments taskId={itemToView.id} />
                </div>
            )}
        </ShadDrawer>
    );
}