import { ProjectMetrics } from '@/types/metric';
import { ActionCard, SectionTitle } from '@/components/custom/metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Users, ListCheck, TrendingUp } from 'lucide-react';

interface ProjectTabProps {
    metrics: ProjectMetrics;
}

export default function ProjectTab({ metrics }: ProjectTabProps) {
    const { summary, projects, developers_by_project, tasks_distribution, sprints_by_project } = metrics;

    const maxTasks = Math.max(1, ...tasks_distribution.map((t) => t.tasks_count));

    return (
        <>
            {/* ========== SUMMARY CARDS ========== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
                <ActionCard
                    label="Active Projects"
                    value={`${summary.active_projects} / ${summary.total_projects}`}
                    icon={<FolderKanban className="w-5 h-5" />}
                    color="blue"
                    sub="Total projects"
                />
                <ActionCard
                    label="Total Developers"
                    value={summary.total_developers}
                    icon={<Users className="w-5 h-5" />}
                    color="purple"
                    sub="In system"
                />
                <ActionCard
                    label="Total Tasks"
                    value={summary.total_tasks}
                    icon={<ListCheck className="w-5 h-5" />}
                    color="green"
                    sub="All projects"
                />
                <ActionCard
                    label="Avg Tasks/Project"
                    value={summary.avg_tasks_per_project}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="yellow"
                    sub="Average"
                />
            </div>

            {/* ========== PROJECTS OVERVIEW ========== */}
            <SectionTitle title="📁 Projects Overview" className="mt-6" />
            <Card className="border-0 shadow-md mb-6">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Project</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Team</th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Developers</th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Tasks</th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Sprints</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-400">
                                            No projects found
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((project) => (
                                        <tr key={project.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{project.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{project.team || '-'}</td>
                                            <td className="px-4 py-3 text-center">{project.developers_count}</td>
                                            <td className="px-4 py-3 text-center">{project.tasks_count}</td>
                                            <td className="px-4 py-3 text-center">{project.sprints_count}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[80px]">
                                                        <div
                                                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${project.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-10 text-right">
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

            {/* ========== DEVELOPERS BY PROJECT ========== */}
            <SectionTitle title="👥 Developers by Project" className="mt-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {developers_by_project.length === 0 ? (
                    <Card className="border-0 shadow-md col-span-full">
                        <CardContent className="text-center py-8 text-gray-400">
                            No developers assigned
                        </CardContent>
                    </Card>
                ) : (
                    developers_by_project.map((item) => (
                        <Card key={item.project_id} className="border-0 shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-semibold text-gray-700 flex items-center justify-between">
                                    <span>{item.project_name}</span>
                                    <Badge variant="secondary">{item.developers_count}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {item.developers.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-2">
                                        No developers
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {item.developers.map((dev) => (
                                            <div
                                                key={dev.id}
                                                className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <Avatar className="w-6 h-6">
                                                    <AvatarImage src={dev.avatar || undefined} />
                                                    <AvatarFallback className="text-xs">
                                                        {dev.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-gray-700">{dev.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* ========== TASKS DISTRIBUTION ========== */}
            <SectionTitle title="📊 Tasks Distribution" className="mt-6" />
            <Card className="border-0 shadow-md mb-6">
                <CardContent className="p-4">
                    {tasks_distribution.length === 0 ? (
                        <p className="text-center py-8 text-gray-400">
                            No tasks found
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {tasks_distribution.map((item) => {
                                const percentage = (item.tasks_count / maxTasks) * 100;
                                return (
                                    <div key={item.project_id} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 w-40 truncate">
                                            {item.project_name}
                                        </span>
                                        <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                                                style={{ width: `${Math.max(5, percentage)}%` }}
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

            {/* ========== SPRINTS BY PROJECT ========== */}
            <SectionTitle title="🏃 Sprints by Project" className="mt-6" />
            <Card className="border-0 shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Project</th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Total</th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Active</th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sprints_by_project.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-400">
                                            No sprints found
                                        </td>
                                    </tr>
                                ) : (
                                    sprints_by_project.map((item) => (
                                        <tr key={item.project_id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{item.project_name}</td>
                                            <td className="px-4 py-3 text-center">{item.total_sprints}</td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant="info">{item.active_sprints}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant="success">{item.completed_sprints}</Badge>
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