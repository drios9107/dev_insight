// resources/js/pages/metrics/index.tsx

import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { GitCommit, Clock, AlertCircle, Star, Eye, FileCheck, Clock as ClockIcon } from 'lucide-react';
import { MetricsPageProps } from '@/types/metric';
import { MetricCard, StatCard, TeamMembersList, ActionCard, SectionTitle, RankingCard } from '@/components/custom/metrics'
import moment from 'moment';
import Header from '@/components/custom/header';
import BodyWrapper from '@/components/custom/body-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import metric from '@/routes/metric';
import commit from '@/routes/commit';
import pullRequest from '@/routes/pull-request';
import pullRequestReview from '@/routes/pull-request-review';
import githubIssue from '@/routes/github-issue';
import ShadSelect from '@/components/custom/inputs/shad-select';
import SingleData from '@/components/custom/metrics/single-data';

const cardRoutes: Record<string, string> = {
    'Total Commits': commit.index().url,
    'Pull Requests': pullRequest.index().url,
    'Issues': githubIssue.index().url,
    'Reviews': pullRequestReview.index().url,
};

export default function Metric({ metrics, repositories, selected_repository, title }: MetricsPageProps) {
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

    return (
        <>
            <Head title={title} />
            <h1 className="sr-only">{title}</h1>
            <Header title={title}>
                <div className="flex items-center gap-4">
                    <ShadSelect label="Repository" name="owner_id" value={selectedRepo} onChange={handleRepoChange} list={repositories.map(i => ({ value: String(i.id), label: i.full_name }))} />
                </div>
            </Header>

            <BodyWrapper>
                {/* ========== METRIC CARDS ========== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
                    {metrics.cards.map((card, index) => (
                        <MetricCard
                            key={index}
                            label={card.label}
                            value={card.value}
                            icon={<GitCommit className="w-6 h-6" />}
                            color={card.color as any}
                            sub={card.sub}
                            trend={card.trend as any}
                            trendValue={card.trendValue}
                            route={cardRoutes[card.label]}
                        />
                    ))}
                </div>

                {/* ========== STAT CARDS ========== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
                    <StatCard label="Avg Commits/Day" value={metrics.avg_commits_per_day} />
                    <StatCard label="Avg PR Merge Time" value={`${metrics.avg_pr_merge_time}h`} />
                    <StatCard label="Avg Issue Close Time" value={`${metrics.avg_issue_close_time}d`} />
                    <StatCard label="Active Developers (30d)" value={metrics.active_developers} />
                </div>

                {/* ========== TEAM MEMBERS ========== */}
                <TeamMembersList members={metrics.team_members} />

                {/* ========== ACTION CARDS ========== */}
                <SectionTitle title="⚡ Actions & Alerts" className="mt-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
                    <ActionCard
                        label="Stale PRs (7+ days)"
                        value={metrics.stale_prs}
                        icon={<Clock className="w-5 h-5" />}
                        color="yellow"
                        sub="No activity in 7 days"
                    />
                    <ActionCard
                        label="PRs Needing Review"
                        value={metrics.prs_needing_review}
                        icon={<Eye className="w-5 h-5" />}
                        color="blue"
                        sub="Open PRs with 0 reviews"
                    />
                    <ActionCard
                        label="Inactive Devs (7+ days)"
                        value={metrics.inactive_developers}
                        icon={<AlertCircle className="w-5 h-5" />}
                        color="red"
                        sub="No commits in 7 days"
                    />
                    <ActionCard
                        label="PR Merge Rate"
                        value={`${metrics.pr_merge_rate}%`}
                        icon={<FileCheck className="w-5 h-5" />}
                        color="green"
                        sub={`${metrics.prs_merged} merged / ${metrics.prs_total} total`}
                    />
                </div>

                {/* ========== RANKING CARDS ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full">
                    <RankingCard
                        title="🏆 Top Contributors"
                        icon={<Star className="w-4 h-4" />}
                        items={metrics?.top_contributors?.map((c: any) => ({
                            name: c.name,
                            username: c.username,
                            avatar: c.avatar,
                            value: c.score,
                            label: 'points',
                        }))}
                    />
                    <RankingCard
                        title="⚡ Most Commits"
                        icon={<GitCommit className="w-4 h-4" />}
                        items={metrics.top_committers.map((c: any) => ({
                            name: c.name,
                            username: c.username,
                            avatar: c.avatar,
                            value: c.commits,
                            label: 'commits',
                        }))}
                    />
                </div>

                {/* ========== CHARTS ========== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full">
                    {/* Commits per day chart (keep as is) */}
                    <Card className="border-0 shadow-md overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-gray-700">
                                Commits per Day (30 days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="h-32 w-full overflow-visible">
                                {metrics.commits_by_day.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                        No commits found
                                    </div>
                                ) : (
                                    <div className="flex items-end h-full gap-1">
                                        {metrics.commits_by_day.map((item) => {
                                            const max = Math.max(1, ...metrics.commits_by_day.map((c) => c.count));
                                            const height = Math.max(4, (item.count / max) * 100);
                                            const date = moment(item.date);

                                            return (
                                                <div
                                                    key={item.date}
                                                    className="flex-1 flex flex-col items-center group relative"
                                                >
                                                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
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
                                                        {date.format('MM/DD')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Code Quality */}
                    <Card className="border-0 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-gray-700">
                                📊 Code Quality Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <SingleData title='Approval Rate' value={`${metrics.code_quality.approval_rate}%`} color='green' />
                                <SingleData title='Changes Requested' value={`${metrics.code_quality.changes_requested_rate}%`} color='yellow' />
                                <SingleData title='Merge Rate' value={`${metrics.code_quality.merge_rate}%`} color='blue' />
                                <SingleData title='Avg Reviews/PR' value={`${metrics.code_quality.avg_reviews_per_pr}`} color='purple' />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ========== PR CYCLE TIME ========== */}
                <Card className="border-0 shadow-md mb-6 w-full lg:w-auto">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-700">
                            ⏱️ PR Cycle Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <SingleData title='Average' value={`${metrics.pr_cycle_time.avg}h`} color='gray' />
                            <SingleData title='Min' value={`${metrics.pr_cycle_time.min}h`} color='green' />
                            <SingleData title='Max' value={`${metrics.pr_cycle_time.max}h`} color='red' />
                            <SingleData title='Median' value={`${metrics.pr_cycle_time.median}h`} color='blue' />
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 justify-center">
                            <span>P25: {metrics.pr_cycle_time.p25}h</span>
                            <span>P75: {metrics.pr_cycle_time.p75}h</span>
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
