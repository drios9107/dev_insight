import CustomAvatar from '@/components/custom/custom-avatar';
import { SectionTitle } from '@/components/custom/metrics';
import NoItemAssignedCard from '@/components/custom/no-item-assigned-card';
import TaskStat from '@/components/custom/task-stat';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TasksByDeveloperRow } from '@/types/metric';

interface TasksByDeveloperSectionProps {
    tasks_by_developer: TasksByDeveloperRow[];
}

export default function TasksByDeveloperSection({
    tasks_by_developer,
}: TasksByDeveloperSectionProps) {
    return (
        <>
            <SectionTitle title="📋 Tasks by Developer" className="mt-6" />
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {tasks_by_developer.length === 0 ? (
                    <NoItemAssignedCard text="No tasks assigned" />
                ) : (
                    tasks_by_developer.map((dev) => (
                        <Card key={dev.id} className="border-0 shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <CustomAvatar
                                            src={dev.avatar ?? undefined}
                                            title={dev.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        />
                                        <span>{dev.name}</span>
                                    </div>
                                    <Badge variant="secondary">
                                        {dev.total}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                                    <TaskStat
                                        label="Backlog"
                                        value={dev.backlog}
                                        color="gray"
                                        href={`/task?assignee_id=${dev.id}&status=backlog&page=1`}
                                    />
                                    <TaskStat
                                        label="To Do"
                                        value={dev.todo}
                                        color="blue"
                                        href={`/task?assignee_id=${dev.id}&status=todo&page=1`}
                                    />
                                    <TaskStat
                                        label="In Progress"
                                        value={dev.in_progress}
                                        color="yellow"
                                        href={`/task?assignee_id=${dev.id}&status=in_progress&page=1`}
                                    />
                                    <TaskStat
                                        label="Review"
                                        value={dev.review}
                                        color="purple"
                                        href={`/task?assignee_id=${dev.id}&status=review&page=1`}
                                    />
                                    <TaskStat
                                        label="Done"
                                        value={dev.done}
                                        color="green"
                                        href={`/task?assignee_id=${dev.id}&status=done&page=1`}
                                    />
                                    <TaskStat
                                        label="Cancelled"
                                        value={dev.cancelled}
                                        color="red"
                                        href={`/task?assignee_id=${dev.id}&status=cancelled&page=1`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </>
    );
}
