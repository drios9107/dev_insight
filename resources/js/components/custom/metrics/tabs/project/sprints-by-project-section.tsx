import { SectionTitle } from '@/components/custom/metrics';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { SprintsByProject } from '@/types/metric';

interface SprintsByProjectSectionProps {
    sprints_by_project: SprintsByProject[];
}

export default function SprintsByProjectSection({
    sprints_by_project,
}: SprintsByProjectSectionProps) {
    return (
        <>
            <SectionTitle title="🏃 Sprints by Project" className="mt-6" />
            <Card className="overflow-hidden border-0 py-0 shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Project
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Active
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Completed
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sprints_by_project.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-8 text-center text-gray-400"
                                        >
                                            No sprints found
                                        </td>
                                    </tr>
                                ) : (
                                    sprints_by_project.map((item) => (
                                        <tr
                                            key={item.project_id}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {item.project_name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {item.total_sprints}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant="info">
                                                    {item.active_sprints}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant="success">
                                                    {item.completed_sprints}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
