import { DeveloperMetrics } from '@/types/metric';
import { ActionCard, SectionTitle } from '@/components/custom/metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GitCommit, UserCheck, UserX } from 'lucide-react';
import { Link } from '@inertiajs/react';
import TaskStat from '../../task-stat';
import NoItemAssignedCard from '../../no-item-assigned-card';
import CustomAvatar from '../../custom-avatar';

interface DeveloperTabProps {
    metrics: DeveloperMetrics;
}

export default function DeveloperTab({ metrics }: DeveloperTabProps) {
    const { summary, ranking, tasks_by_developer, projects_by_developer } =
        metrics;

    return (
        <>
            {/* ========== SUMMARY CARDS ========== */}
            <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ActionCard
                    label="Total Developers"
                    value={summary.total}
                    icon={<Users className="h-5 w-5" />}
                    color="blue"
                    sub="In system"
                />
                <ActionCard
                    label="Active (7d)"
                    value={summary.active}
                    icon={<UserCheck className="h-5 w-5" />}
                    color="green"
                    sub="With commits"
                />
                <ActionCard
                    label="Inactive (7d)"
                    value={summary.inactive}
                    icon={<UserX className="h-5 w-5" />}
                    color="red"
                    sub="No commits"
                />
                <ActionCard
                    label="Avg Commits/Dev"
                    value={summary.avg_commits}
                    icon={<GitCommit className="h-5 w-5" />}
                    color="purple"
                    sub="Average"
                />
            </div>

            {/* ========== RANKING TABLE ========== */}
            <SectionTitle title="🏆 Developer Ranking" className="mt-6" />
            <Card className="overflow-hidden border-0 py-0 shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Developer
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Commits
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        PRs
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Reviews
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Issues
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Tasks
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Projects
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-8 text-center text-gray-400"
                                        >
                                            No developers found
                                        </td>
                                    </tr>
                                ) : (
                                    ranking.map((dev) => (
                                        <tr
                                            key={dev.id}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <CustomAvatar
                                                        src={
                                                            dev?.avatar ??
                                                            undefined
                                                        }
                                                        title={dev.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                        className="h-8 w-8"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {dev.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            @{dev.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.commits}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.prs}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.reviews}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.issues}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-medium">
                                                    {dev.tasks_total}
                                                </span>
                                                <span className="ml-1 text-xs text-gray-400">
                                                    ({dev.tasks_open} open)
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.projects}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ========== TASKS BY DEVELOPER ========== */}
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

            {/* ========== PROJECTS BY DEVELOPER ========== */}
            <SectionTitle title="📁 Projects by Developer" className="mt-6" />
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {projects_by_developer.length === 0 ? (
                    <NoItemAssignedCard text="No projects assigned" />
                ) : (
                    projects_by_developer.map((dev) => (
                        <Card key={dev.id} className="border-0 shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <CustomAvatar
                                            src={dev?.avatar ?? undefined}
                                            title={dev.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        />
                                        <span>{dev.name}</span>
                                    </div>
                                    <Badge variant="secondary">
                                        {dev.projects_count}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {dev.projects.length === 0 ? (
                                    <p className="py-2 text-center text-sm text-gray-400">
                                        No projects
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {dev.projects.map((project) => (
                                            <Link
                                                key={project.id}
                                                href={`/metric?tab=project&project_id=${project.id}`}
                                                className="transition-transform hover:scale-105"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-gray-100"
                                                >
                                                    {project.name}
                                                </Badge>
                                            </Link>
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
