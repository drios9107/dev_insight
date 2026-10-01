import { SectionTitle } from '@/components/custom/metrics';
import { Card, CardContent } from '@/components/ui/card';
import type { ProjectWithStats } from '@/types/metric';

interface ProjectsOverviewSectionProps {
    projects: ProjectWithStats[];
}

export default function ProjectsOverviewSection({
    projects,
}: ProjectsOverviewSectionProps) {
    return (
        <>
            <SectionTitle title="📁 Projects Overview" className="mt-6" />
            <Card className="mb-6 overflow-hidden border-0 py-0 shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Project
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Team
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Developers
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Tasks
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Sprints
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Progress
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-8 text-center text-gray-400"
                                        >
                                            No projects found
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((project) => (
                                        <tr
                                            key={project.id}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {project.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {project.team || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {project.developers_count}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {project.tasks_count}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {project.sprints_count}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 min-w-[80px] flex-1 overflow-hidden rounded-full bg-gray-100">
                                                        <div
                                                            className="h-full rounded-full bg-green-500 transition-all duration-500"
                                                            style={{
                                                                width: `${project.progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="w-10 text-right text-xs text-gray-500">
                                                        {project.progress}%
                                                    </span>
                                                </div>
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
