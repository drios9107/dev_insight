// resources/js/pages/metrics/index.tsx

import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { MetricsPageProps } from '@/types/metric';
import { TeamMembersList, SectionTitle, MetricsSection, StatsSection, ActionCardsSection, RankingCardsSection, ChartsSection, PrCycleSection, } from '@/components/custom/metrics'
import Header from '@/components/custom/header';
import BodyWrapper from '@/components/custom/body-wrapper';
import metric from '@/routes/metric';
import ShadSelect from '@/components/custom/inputs/shad-select';
import { Label } from '@/components/ui/label';


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
                <div className="flex items-center gap-4" style={{
                    width: '250px',
                }}>
                    <Label htmlFor="repo_id">
                        Repository
                    </Label>
                    <ShadSelect name="repo_id" value={selectedRepo} onChange={handleRepoChange} list={repositories.map(i => ({ value: String(i.id), label: i.full_name }))} />
                </div>
            </Header>

            <BodyWrapper>
                {/* ========== METRIC CARDS ========== */}
                <MetricsSection cards={metrics.cards} />

                {/* ========== STAT CARDS ========== */}
                <StatsSection
                    active_developers={metrics.active_developers}
                    avg_commits_per_day={metrics.avg_commits_per_day}
                    avg_issue_close_time={metrics.avg_issue_close_time}
                    avg_pr_merge_time={metrics.avg_pr_merge_time}
                />


                {/* ========== TEAM MEMBERS ========== */}
                <TeamMembersList members={metrics.team_members} />

                {/* ========== ACTION CARDS ========== */}
                <SectionTitle title="⚡ Actions & Alerts" className="mt-6" />
                <ActionCardsSection
                    inactive_developers={metrics.inactive_developers}
                    pr_merge_rate={metrics.pr_merge_rate}
                    prs_merged={metrics.prs_merged}
                    prs_needing_review={metrics.prs_needing_review}
                    prs_total={metrics.prs_total}
                    stale_prs={metrics.stale_prs}
                />

                {/* ========== RANKING CARDS ========== */}
                <RankingCardsSection top_committers={metrics.top_committers} top_contributors={metrics.top_contributors} />

                {/* ========== CHARTS ========== */}
                <ChartsSection code_quality={metrics.code_quality} commits_by_day={metrics.commits_by_day} />

                {/* ========== PR CYCLE TIME ========== */}
                <PrCycleSection pr_cycle_time={metrics.pr_cycle_time} />
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
