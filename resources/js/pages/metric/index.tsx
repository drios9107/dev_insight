// resources/js/pages/metrics/index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Header from '@/components/custom/header';
import BodyWrapper from '@/components/custom/body-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import moment from 'moment';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GitCommit, GitPullRequest, Bug, CheckSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MetricsPageProps, MetricCard, TopDeveloper, TopReviewer } from '@/types/metric';
import metric from '@/routes/metric';
import commit from '@/routes/commit';
import pullRequest from '@/routes/pull-request';
import pullRequestReview from '@/routes/pull-request-review';
import githubIssue from '@/routes/github-issue';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    GitCommit,
    GitPullRequest,
    Bug,
    CheckSquare,
};

const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    gray: 'from-gray-500 to-gray-600',
};

const trendMap: Record<string, React.ComponentType<{ className?: string }>> = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
};

export default function Metric({
    metrics,
    repositories,
    selected_repository,
    title,
}: MetricsPageProps) {
    const [selectedRepo, setSelectedRepo] = useState<string>(
        selected_repository ? String(selected_repository) : 'all'
    );

    const handleRepoChange = (value: string) => {
        setSelectedRepo(value);
        router.get(
            window.location.pathname,
            { repository_id: value === 'all' ? null : value },
            { preserveState: true }
        );
    };

    // Calcular valores máximos para gráficos
    const maxCommits = Math.max(1, ...metrics.commits_by_day.map((c) => c.count));
    const maxCommitsWeek = Math.max(1, ...metrics.commits_by_week.map((c) => c.count));

    const cardRoutes: Record<string, string> = {
        'Total Commits': commit.index().url,
        'Pull Requests': pullRequest.index().url,
        'Issues': githubIssue.index().url,
        'Reviews': pullRequestReview.index().url,
    };

    return (
        <>
            <Head title={title} />
            <h1 className="sr-only">{title}</h1>
            <Header title={title}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="repository-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Repository
                        </Label>
                        <Select value={selectedRepo} onValueChange={handleRepoChange}>
                            <SelectTrigger id="repository-filter" className="w-[220px]">
                                <SelectValue placeholder="All Repositories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Repositories</SelectItem>
                                {repositories.map((repo) => (
                                    <SelectItem key={repo.id} value={String(repo.id)}>
                                        {repo.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Header>

            <BodyWrapper>
                {/* ========== CARDS ========== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {metrics.cards.map((card: MetricCard, index: number) => {
                        const Icon = iconMap[card.icon] || GitCommit;
                        const TrendIcon = trendMap[card.trend || 'neutral'] || Minus;
                        const route = cardRoutes[card.label] || '#';

                        return (
                            <Link
                                key={index}
                                href={route}
                                className="block transition-transform duration-200 hover:scale-[1.02]"
                            >
                                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer" style={{ height: '228px' }}>
                                    <div className={`h-1 w-full bg-gradient-to-r ${colorMap[card.color]}`} />
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    {card.label}
                                                </p>
                                                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                                                    {card.value.toLocaleString()}
                                                </p>
                                                {card.sub && (
                                                    <p className="text-sm text-gray-400">{card.sub}</p>
                                                )}
                                                {card.trend !== undefined && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <TrendIcon className={`w-4 h-4 ${card.trend === 'up' ? 'text-green-500' :
                                                            card.trend === 'down' ? 'text-red-500' :
                                                                'text-gray-400'
                                                            }`} />
                                                        <span className={`text-xs font-medium ${card.trend === 'up' ? 'text-green-600' :
                                                            card.trend === 'down' ? 'text-red-600' :
                                                                'text-gray-400'
                                                            }`}>
                                                            {card.trendValue || ''}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[card.color]} text-white shadow-lg`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* ========== ESTADÍSTICAS ========== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="border-0 shadow-md h-full">
                        <CardContent className="p-4 flex flex-col h-full justify-center">
                            <p className="text-sm font-medium text-gray-500">Avg Commits/Day</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.avg_commits_per_day}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md h-full">
                        <CardContent className="p-4 flex flex-col h-full justify-center">
                            <p className="text-sm font-medium text-gray-500">Avg PR Merge Time</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.avg_pr_merge_time}h</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md h-full">
                        <CardContent className="p-4 flex flex-col h-full justify-center">
                            <p className="text-sm font-medium text-gray-500">Avg Issue Close Time</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.avg_issue_close_time}d</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md h-full">
                        <CardContent className="p-4 flex flex-col h-full justify-center">
                            <p className="text-sm font-medium text-gray-500">Active Developers (30d)</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.active_developers}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* ========== GRÁFICOS ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Commits por día */}
                    <Card className="border-0 shadow-md overflow-hidden h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-gray-700">
                                Commits per Day (30 days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="h-64 w-full overflow-visible">
                                {metrics.commits_by_day.length === 0 ?
                                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                        No commits found
                                    </div> :
                                    <div className="flex items-end h-full gap-1">
                                        {metrics.commits_by_day.map((item, idx) => {
                                            const height = Math.max(4, (item.count / maxCommits) * 100);
                                            const date = moment(item.date);
                                            return (
                                                <div
                                                    key={item.date}
                                                    className="flex-1 flex flex-col items-center group relative"
                                                >
                                                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                                                        {item.count} commits
                                                        <br />
                                                        {date.format('YYYY/MM/DD')}
                                                    </div>
                                                    <div
                                                        className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t transition-all duration-300 hover:from-blue-500 hover:to-blue-600"
                                                        style={{
                                                            height: `${height}%`,
                                                            minHeight: '4px',
                                                        }}
                                                    />
                                                    <span className="text-[10px] text-gray-400 mt-1 transform rotate-45 origin-bottom-left">
                                                        {date.format('YY/MM/DD')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* PRs por estado */}
                    <Card className="border-0 shadow-md h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-gray-700">
                                Pull Requests by State
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {Object.entries(metrics.prs_by_state).map(([state, count]) => {
                                    const total = Object.values(metrics.prs_by_state).reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? (count / total) * 100 : 0;
                                    const color =
                                        state === 'open' ? 'bg-blue-500' :
                                            state === 'merged' ? 'bg-green-500' :
                                                'bg-gray-400';
                                    const bgColor =
                                        state === 'open' ? 'bg-blue-50' :
                                            state === 'merged' ? 'bg-green-50' :
                                                'bg-gray-50';
                                    return (
                                        <div key={state} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="capitalize font-medium text-gray-700">{state}</span>
                                                <span className="font-semibold text-gray-900">{count}</span>
                                            </div>
                                            <div className={`h-2 rounded-full overflow-hidden ${bgColor}`}>
                                                <div
                                                    className={`h-full rounded-full ${color} transition-all duration-500`}
                                                    style={{ width: `${Math.max(1, percentage)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ========== TABLAS ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Top Developers */}
                    <Card className="border-0 shadow-md h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-gray-700">
                                Top Developers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                                {metrics.top_developers.map((dev: TopDeveloper, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-sm font-medium text-gray-400 w-6 text-right">
                                                #{index + 1}
                                            </span>
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 overflow-hidden flex-shrink-0">
                                                {dev.avatar ? (
                                                    <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    dev.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-gray-900 truncate">{dev.name}</p>
                                                <p className="text-xs text-gray-400 truncate">@{dev.username}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-2">
                                            <p className="font-bold text-gray-900">{dev.commits}</p>
                                            <p className="text-xs text-gray-400">{dev.active_days} days</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Reviewers */}
                    <Card className="border-0 shadow-md h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-gray-700">
                                Top Reviewers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                                {metrics.top_reviewers.map((reviewer: TopReviewer, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-sm font-medium text-gray-400 w-6 text-right">
                                                #{index + 1}
                                            </span>
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 overflow-hidden flex-shrink-0">
                                                {reviewer.avatar ? (
                                                    <img src={reviewer.avatar} alt={reviewer.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    reviewer.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-gray-900 truncate">{reviewer.name}</p>
                                                <p className="text-xs text-gray-400 truncate">@{reviewer.username}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-2">
                                            <p className="font-bold text-gray-900">{reviewer.total_reviews}</p>
                                            <p className="text-xs text-green-600 font-medium">
                                                {reviewer.approval_rate}% approved
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* // ========== NUEVA SECCIÓN: DEVELOPER RANKING ========== */}
                <Card className="border-0 shadow-md mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-700">
                            🏆 Developer Rankings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Most Commits', data: metrics.developer_ranking.most_commits, icon: GitCommit },
                                { label: 'Most PRs', data: metrics.developer_ranking.most_prs, icon: GitPullRequest },
                                { label: 'Most Reviews', data: metrics.developer_ranking.most_reviews, icon: CheckSquare },
                                { label: 'Highest Productivity', data: metrics.developer_ranking.highest_productivity, icon: TrendingUp },
                            ].map((item, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                    {item.data ? (
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 overflow-hidden">
                                                {item.data.avatar ? (
                                                    <img src={item.data.avatar} alt={item.data.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    item.data.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.data.name}</p>
                                                <p className="text-xs text-gray-400">@{item.data.username}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 mt-2">No data</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* // ========== NUEVA SECCIÓN: CODE QUALITY ========== */}
                <Card className="border-0 shadow-md mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-700">
                            📊 Code Quality Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{metrics.code_quality.approval_rate}%</p>
                                <p className="text-xs text-gray-500">Approval Rate</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-600">{metrics.code_quality.changes_requested_rate}%</p>
                                <p className="text-xs text-gray-500">Changes Requested</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{metrics.code_quality.merge_rate}%</p>
                                <p className="text-xs text-gray-500">Merge Rate</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600">{metrics.code_quality.avg_reviews_per_pr}</p>
                                <p className="text-xs text-gray-500">Avg Reviews/PR</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* // ========== NUEVA SECCIÓN: PR CYCLE TIME ========== */}
                <Card className="border-0 shadow-md mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-700">
                            ⏱️ PR Cycle Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{metrics.pr_cycle_time.avg}h</p>
                                <p className="text-xs text-gray-500">Average</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{metrics.pr_cycle_time.min}h</p>
                                <p className="text-xs text-gray-500">Min</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">{metrics.pr_cycle_time.max}h</p>
                                <p className="text-xs text-gray-500">Max</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{metrics.pr_cycle_time.median}h</p>
                                <p className="text-xs text-gray-500">Median</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 justify-center">
                            <span>P25: {metrics.pr_cycle_time.p25}h</span>
                            <span>P75: {metrics.pr_cycle_time.p75}h</span>
                        </div>
                    </CardContent>
                </Card>

                {/* ========== RECENT ACTIVITY ========== */}
                <Card className="border-0 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-700">
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                            {metrics.recent_activity.map((activity, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-150"
                                >
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${activity.type === 'commit' ? 'bg-blue-500' :
                                            activity.type === 'pull_request' ? 'bg-purple-500' :
                                                'bg-gray-400'
                                            }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 break-words">
                                            <span className="font-medium">{activity.author}</span>
                                            {' '}
                                            <span className="text-gray-500">
                                                {activity.type === 'commit' ? 'committed' : 'opened PR'}
                                            </span>
                                            {' '}
                                            <span className="text-gray-700 break-words">{activity.message}</span>
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-gray-400 truncate">
                                                {activity.repository}
                                            </span>
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-xs text-gray-400 flex-shrink-0">
                                                {activity.date}
                                            </span>
                                        </div>
                                    </div>
                                    {activity.url && (
                                        <a
                                            href={activity.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 text-sm font-medium flex-shrink-0 mt-1"
                                        >
                                            View →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </BodyWrapper>
        </>
    );
}
Metric.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: metric.index(),
        },
    ],
};
