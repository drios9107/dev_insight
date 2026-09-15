// resources/js/pages/metrics/index.tsx

import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { MetricsPageProps } from '@/types/metric';
import { TeamMembersList, SectionTitle, MetricsSection, StatsSection, RankingCardsSection, ChartsSection, ManagementSection, CodeQualitySection, } from '@/components/custom/metrics'
import Header from '@/components/custom/header';
import BodyWrapper from '@/components/custom/body-wrapper';
import metric from '@/routes/metric';
import ShadSelect from '@/components/custom/inputs/shad-select';
import { Label } from '@/components/ui/label';
import { SyncButton } from '@/components/custom/metrics/section-components/sync-button';


export default function Metric({ metrics, repositories, selected_repository, title, ...props }: MetricsPageProps) {
    const [selectedRepo, setSelectedRepo] = useState<string>(
        selected_repository ? String(selected_repository) : 'all'
    );

    const handleRepoChange = useCallback((value: string) => {
        setSelectedRepo(value);
        router.get(
            window.location.pathname,
            { repository_id: value === 'all' ? null : value },
            { preserveState: true }
        );
    }, [setSelectedRepo]);

    return (
        <>
            <Head title={title} />
            <h1 className="sr-only">{title}</h1>
            <Header title={title}>
                <div className="flex items-center gap-4" style={{
                    minWidth: '250px',
                }}>
                    <Label htmlFor="repo_id" className='font-normal'>
                        Repository
                    </Label>
                    <ShadSelect name="repo_id" value={selectedRepo} onChange={handleRepoChange} list={repositories.map(i => ({ value: String(i.id), label: i.full_name }))} />
                    <SyncButton repositoryId={selectedRepo} />
                </div>
            </Header>

            <BodyWrapper>
                {/* ========== METRIC CARDS ========== */}
                <MetricsSection cards={metrics.cards} />
                {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}

                {/* ========== KEY METRICS + STATS OVERVIEW ========== */}
                <SectionTitle title="📊 Key Metrics" className="mt-6" />
                <StatsSection
                    active_developers={metrics.active_developers}
                    avg_commits_per_day={metrics.avg_commits_per_day}
                    avg_issue_close_time={metrics.avg_issue_close_time}
                    avg_pr_merge_time={metrics.avg_pr_merge_time}
                    active_projects={metrics.active_projects}
                    total_projects={metrics.total_projects}
                    active_sprints={metrics.active_sprints}
                    total_sprints={metrics.total_sprints}
                    open_issues={metrics.open_issues}
                    total_issues={metrics.total_issues}
                    tasks_in_progress={metrics.tasks_in_progress}
                    tasks_in_review={metrics.tasks_in_review}
                    total_tasks={metrics.total_tasks}
                />

                {/* ========== MANAGEMENT + ALERTS (UNIFICADO) ========== */}
                <SectionTitle title="📋 Management Overview" className="mt-6" />
                <ManagementSection
                    sprint_completion_rate={metrics.sprint_completion_rate}
                    task_completion_rate={metrics.task_completion_rate}
                    avg_issue_resolution_time={metrics.avg_issue_resolution_time}
                    overdue_tasks={metrics.overdue_tasks}
                    stale_prs={metrics.stale_prs}
                    prs_needing_review={metrics.prs_needing_review}
                    inactive_developers={metrics.inactive_developers}
                    pr_merge_rate={metrics.pr_merge_rate}
                    prs_merged={metrics.prs_merged}
                    prs_total={metrics.prs_total}
                />

                {/* ========== TEAM MEMBERS ========== */}
                <SectionTitle title="👥 Team Members" className="mt-6" />
                <TeamMembersList members={metrics.team_members} />

                {/* ========== RANKING CARDS ========== */}
                <RankingCardsSection top_committers={metrics.top_committers} top_contributors={metrics.top_contributors} />

                {/* ========== CHARTS ========== */}
                <ChartsSection
                    commits_by_day={metrics.commits_by_day}
                    days_without_commit={metrics.days_without_commit}
                />

                {/* ========== CODE QUALITY ========== */}
                <CodeQualitySection
                    code_quality={metrics.code_quality}
                    pr_cycle_time={metrics.pr_cycle_time}
                />
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
