// resources/js/components/custom/tasks/task-details.tsx

import { ITask } from '@/types/models/task';
import { Badge } from '@/components/ui/badge';
import { TaskPriorityEnum, TaskStatusEnum, TTaskPriority, TTaskStatus } from '@/enums/task';
import { Clock, User, FolderKanban, ListStart, Calendar, Award, TrendingUp } from 'lucide-react';
import ShadDrawer from '../shad-drawer';
import { getTaskPriorityColor, getTaskStatusColor } from '@/lib/utils/task';
import DetailItem from '../detail-item';

interface TaskDetailsProps {
    itemToView: ITask;
    onClose: () => void
}

export function TaskDetails({ itemToView, onClose }: TaskDetailsProps) {
    return (
        <ShadDrawer
            title='Task'
            isOpen
            setIsOpen={onClose}
        >
            <div className="space-y-6">
                {/* ========== HEADER ========== */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{itemToView.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getTaskStatusColor(itemToView.status)}>
                            {TaskStatusEnum[itemToView.status as TTaskStatus]}
                        </Badge>
                        <Badge variant={getTaskPriorityColor(itemToView.priority)}>
                            {TaskPriorityEnum[itemToView.priority as TTaskPriority]}
                        </Badge>
                    </div>
                </div>

                {/* ========== METADATA ========== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem icon={FolderKanban} label="Project" value={itemToView.project?.name} />
                    <DetailItem icon={ListStart} label="Sprint" value={itemToView.sprint?.name} />
                    <DetailItem icon={User} label="Assignee" value={itemToView.assignee?.name} />
                    <DetailItem icon={User} label="Reporter" value={itemToView.reporter?.name} />
                    <DetailItem icon={Calendar} label="Due Date" value={itemToView.due_date} />
                    <DetailItem icon={Clock} label="Hours Estimate" value={itemToView.hours_estimate ? `${itemToView.hours_estimate}h` : null} />
                    <DetailItem icon={Clock} label="Hours Spent" value={itemToView.hours_spent ? `${itemToView.hours_spent}h` : null} />
                    <DetailItem icon={Award} label="Story Points" value={itemToView.story_points} />
                    <DetailItem icon={TrendingUp} label="Order" value={itemToView.order} />
                </div>

                {/* ========== DESCRIPTION ========== */}
                {itemToView.description && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                        <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                            {itemToView.description}
                        </div>
                    </div>
                )}

                {/* ========== DATES ========== */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-4 border-t">
                    <div>
                        <span className="font-medium">Created:</span> {itemToView.created_at}
                    </div>
                    <div>
                        <span className="font-medium">Updated:</span> {itemToView.updated_at}
                    </div>
                    {itemToView.completed_at && (
                        <div>
                            <span className="font-medium">Completed:</span> {itemToView.completed_at}
                        </div>
                    )}
                </div>
            </div>
        </ShadDrawer>
    );
}
