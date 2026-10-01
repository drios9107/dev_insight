import {
    MetricsSection,
    StatsSection,
    TeamMembersList,
    SectionTitle,
    ManagementSection,
    RankingCardsSection,
    ChartsSection,
    CodeQualitySection,
} from '@/components/custom/metrics';
import type { RepositoryMetrics } from '@/types/metric';

interface RepositoryTabProps {
    metrics: RepositoryMetrics;
}

export default function RepositoryTab({ metrics }: RepositoryTabProps) {
    return (
        <>
            {/* ========== METRIC CARDS ========== */}
            <MetricsSection cards={metrics.cards} />

            {/* ========== KEY METRICS ========== */}
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

            {/* ========== MANAGEMENT OVERVIEW ========== */}
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

            {/* ========== RANKINGS ========== */}
            <SectionTitle title="🏆 Rankings" className="mt-6" />
            <RankingCardsSection
                top_committers={metrics.top_committers}
                top_contributors={metrics.top_contributors}
            />

            {/* ========== CHARTS ========== */}
            <SectionTitle title="📈 Charts" className="mt-6" />
            <ChartsSection
                commits_by_day={metrics.commits_by_day}
                days_without_commit={metrics.days_without_commit}
            />

            {/* ========== CODE QUALITY + PR CYCLE ========== */}
            <SectionTitle title="📊 Code Quality" className="mt-6" />
            <CodeQualitySection
                code_quality={metrics.code_quality}
                pr_cycle_time={metrics.pr_cycle_time}
            />
        </>
    );
}
