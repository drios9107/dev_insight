import { FolderKanban, Users, ListCheck, TrendingUp } from 'lucide-react';
import { ActionCard, SectionTitle } from '@/components/custom/metrics';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectMetrics } from '@/types/metric';
import CardSectionWrapper from '../section-components/card-section-wrapper';

interface ProjectTabProps {
    metrics: ProjectMetrics;
}

export default function ProjectTab({ metrics }: ProjectTabProps) {
    const {
        summary,
        projects,
        developers_by_project,
        tasks_distribution,
        sprints_by_project,
    } = metrics;

    const maxTasks = Math.max(
        1,
        ...tasks_distribution.map((t) => t.tasks_count),
    );

    return (
        <>
            {/* ========== SUMMARY CARDS ========== */}
            <CardSectionWrapper className="sm:!grid-cols-2 lg:!grid-cols-4">
                <ActionCard
                    label="Active Projects"
                    value={`${summary.active_projects} / ${summary.total_projects}`}
                    icon={<FolderKanban className="h-5 w-5" />}
                    color="blue"
                    sub="Total projects"
                />
                <ActionCard
                    label="Total Developers"
                    value={summary.total_developers}
                    icon={<Users className="h-5 w-5" />}
                    color="purple"
                    sub="In system"
                />
                <ActionCard
                    label="Total Tasks"
                    value={summary.total_tasks}
                    icon={<ListCheck className="h-5 w-5" />}
                    color="green"
                    sub="All projects"
                />
                <ActionCard
                    label="Avg Tasks/Project"
                    value={summary.avg_tasks_per_project}
                    icon={<TrendingUp className="h-5 w-5" />}
                    color="yellow"
                    sub="Average"
                />
            </CardSectionWrapper>

            {/* ========== PROJECTS OVERVIEW ========== */}
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

            {/* ========== DEVELOPERS BY PROJECT ========== */}
            <SectionTitle title="👥 Developers by Project" className="mt-6" />
            <CardSectionWrapper className="gap-6 sm:grid-cols-2">
                {developers_by_project.length === 0 ? (
                    <Card className="col-span-full border-0 shadow-md">
                        <CardContent className="py-8 text-center text-gray-400">
                            No developers assigned
                        </CardContent>
                    </Card>
                ) : (
                    developers_by_project.map((item) => (
                        <Card
                            key={item.project_id}
                            className="border-0 shadow-md"
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-700">
                                    <span>{item.project_name}</span>
                                    <Badge variant="secondary">
                                        {item.developers_count}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {item.developers.length === 0 ? (
                                    <p className="py-2 text-center text-sm text-gray-400">
                                        No developers
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {item.developers.map((dev) => (
                                            <div
                                                key={dev.id}
                                                className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1 transition-colors hover:bg-gray-100"
                                            >
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage
                                                        src={
                                                            dev.avatar ||
                                                            undefined
                                                        }
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {dev.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-gray-700">
                                                    {dev.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </CardSectionWrapper>

            {/* ========== TASKS DISTRIBUTION ========== */}
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

            {/* ========== SPRINTS BY PROJECT ========== */}
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
