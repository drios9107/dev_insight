import CustomAvatar from '@/components/custom/custom-avatar';
import { SectionTitle } from '@/components/custom/metrics';
import NoItemAssignedCard from '@/components/custom/no-item-assigned-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DevelopersByProject } from '@/types/metric';

interface DevelopersByProjectSectionProps {
    developers_by_project: DevelopersByProject[];
}

export default function DevelopersByProjectSection({
    developers_by_project,
}: DevelopersByProjectSectionProps) {
    return (
        <>
            <SectionTitle title="👥 Developers by Project" className="mt-6" />
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {developers_by_project.length === 0 ? (
                    <NoItemAssignedCard text="No developers assigned" />
                ) : (
                    developers_by_project.map((item) => (
                        <Card
                            key={item.project_id}
                            className="border-0 shadow-md"
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-700">
                                    <span>{item.project_name}</span>
                                    <div className="flex items-center gap-1.5">
                                        <Badge variant="secondary">
                                            {item.developers_count}
                                        </Badge>
                                        {item.developers_without_tasks > 0 && (
                                            <Badge variant="warning">
                                                {item.developers_without_tasks}{' '}
                                                available
                                            </Badge>
                                        )}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {item.developers.length === 0 ? (
                                    <p className="py-2 text-center text-sm text-gray-400">
                                        No developers in team
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {item.developers.map((dev) => (
                                            <div
                                                key={dev.id}
                                                className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
                                            >
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <CustomAvatar
                                                        src={
                                                            dev.avatar ??
                                                            undefined
                                                        }
                                                        title={dev.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                        className="shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-gray-900">
                                                            {dev.name}
                                                        </p>
                                                        <p className="truncate text-xs text-gray-400">
                                                            @{dev.username}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    {dev.tasks_total === 0 ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Badge variant="warning">
                                                                Available
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">
                                                                0 done
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="text-xs text-gray-500">
                                                                {dev.tasks_open}{' '}
                                                                open
                                                            </span>
                                                            <span className="text-xs text-gray-300">
                                                                ·
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {dev.tasks_done}{' '}
                                                                done
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </>
    );
}
