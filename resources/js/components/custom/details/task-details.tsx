// resources/js/components/custom/tasks/task-details.tsx

import {
    Clock,
    User,
    FolderKanban,
    ListStart,
    Calendar,
    Award,
    TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TTaskPriority, TTaskStatus } from '@/enums/task';
import { TaskPriorityEnum, TaskStatusEnum } from '@/enums/task';
import { getTaskPriorityColor, getTaskStatusColor } from '@/lib/utils/task';
import type { ITask } from '@/types/models/task';
import DetailItem from '../detail-item';
import { TaskComments } from '../forms/task-comment';
import ShadDrawer from '../shad-drawer';

interface TaskDetailsProps {
    itemToView: ITask;
    onClose: () => void;
}

export function TaskDetails({ itemToView, onClose }: TaskDetailsProps) {
    return (
        <ShadDrawer title="Task" isOpen setIsOpen={onClose}>
            <div className="space-y-6">
                {/* ========== HEADER ========== */}
                <div>
                    <h2 className="mb-2 text-xl font-bold text-gray-900">
                        {itemToView.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={getTaskStatusColor(itemToView.status)}>
                            {TaskStatusEnum[itemToView.status as TTaskStatus]}
                        </Badge>
                        <Badge
                            variant={getTaskPriorityColor(itemToView.priority)}
                        >
                            {
                                TaskPriorityEnum[
                                    itemToView.priority as TTaskPriority
                                ]
                            }
                        </Badge>
                    </div>
                </div>

                {/* ========== METADATA ========== */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailItem
                        icon={FolderKanban}
                        label="Project"
                        value={itemToView.project?.name}
                    />
                    <DetailItem
                        icon={ListStart}
                        label="Sprint"
                        value={itemToView.sprint?.name}
                    />
                    <DetailItem
                        icon={User}
                        label="Assignee"
                        value={itemToView.assignee?.name}
                    />
                    <DetailItem
                        icon={User}
                        label="Reporter"
                        value={itemToView.reporter?.name}
                    />
                    <DetailItem
                        icon={Calendar}
                        label="Due Date"
                        value={itemToView.due_date}
                    />
                    <DetailItem
                        icon={Clock}
                        label="Hours Estimate"
                        value={
                            itemToView.hours_estimate
                                ? `${itemToView.hours_estimate}h`
                                : null
                        }
                    />
                    <DetailItem
                        icon={Clock}
                        label="Hours Spent"
                        value={
                            itemToView.hours_spent
                                ? `${itemToView.hours_spent}h`
                                : null
                        }
                    />
                    <DetailItem
                        icon={Award}
                        label="Story Points"
                        value={itemToView.story_points}
                    />
                    <DetailItem
                        icon={TrendingUp}
                        label="Order"
                        value={itemToView.order}
                    />
                </div>

                {/* ========== DESCRIPTION ========== */}
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

                {/* ========== DATES ========== */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xs text-gray-400">
                    <div>
                        <span className="font-medium">Created:</span>{' '}
                        {itemToView.created_at}
                    </div>
                    <div>
                        <span className="font-medium">Updated:</span>{' '}
                        {itemToView.updated_at}
                    </div>
                    {itemToView.completed_at && (
                        <div>
                            <span className="font-medium">Completed:</span>{' '}
                            {itemToView.completed_at}
                        </div>
                    )}
                </div>

                <TaskComments taskId={itemToView.id} />
            </div>
        </ShadDrawer>
    );
}
