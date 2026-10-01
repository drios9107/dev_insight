import { SectionTitle } from '@/components/custom/metrics';
import { Card, CardContent } from '@/components/ui/card';
import type { TasksDistribution } from '@/types/metric';

interface TasksDistributionSectionProps {
    tasks_distribution: TasksDistribution[];
}

export default function TasksDistributionSection({
    tasks_distribution,
}: TasksDistributionSectionProps) {
    const maxTasks = Math.max(
        1,
        ...tasks_distribution.map((t) => t.tasks_count),
    );

    return (
        <>
            <SectionTitle title="📊 Tasks Distribution" className="mt-6" />
            <Card className="mb-6 border-0 shadow-md">
                <CardContent className="p-4">
                    {tasks_distribution.length === 0 ? (
                        <p className="py-8 text-center text-gray-400">
                            No tasks found
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {tasks_distribution.map((item) => {
                                const percentage =
                                    (item.tasks_count / maxTasks) * 100;

                                return (
                                    <div
                                        key={item.project_id}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="w-40 truncate text-sm text-gray-600">
                                            {item.project_name}
                                        </span>
                                        <div className="h-6 flex-1 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className="flex h-full items-center justify-end rounded-full bg-blue-500 pr-2 transition-all duration-500"
                                                style={{
                                                    width: `${Math.max(5, percentage)}%`,
                                                }}
                                            >
                                                <span className="text-xs font-medium text-white">
                                                    {item.tasks_count}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
