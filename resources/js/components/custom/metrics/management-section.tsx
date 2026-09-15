import { ActionCard } from './section-components/action-card';
import {
    ListStart,
    ListCheck,
    Bug,
    AlertCircle,
    Clock,
    Eye,
    Users,
    FileCheck,
} from 'lucide-react';
import CardSectionWrapper from './section-components/card-section-wrapper';

interface ManagementSectionProps {
    sprint_completion_rate: number;
    task_completion_rate: number;
    avg_issue_resolution_time: number;
    overdue_tasks: number;
    stale_prs: number;
    prs_needing_review: number;
    inactive_developers: number;
    pr_merge_rate: number;
    prs_merged: number;
    prs_total: number;
}

export default function ManagementSection({
    sprint_completion_rate,
    task_completion_rate,
    avg_issue_resolution_time,
    overdue_tasks,
    stale_prs,
    prs_needing_review,
    inactive_developers,
    pr_merge_rate,
    prs_merged,
    prs_total,
}: ManagementSectionProps) {
    return (
        <CardSectionWrapper className="sm:grid-cols-2 lg:grid-cols-4">
            {/* ========== MANAGEMENT ========== */}
            <ActionCard
                label="Sprint Completion"
                value={`${sprint_completion_rate}%`}
                icon={<ListStart className="w-5 h-5" />}
                color="green"
                sub="Completed sprints"
                link="/sprint?status=completed"
            />
            <ActionCard
                label="Task Completion"
                value={`${task_completion_rate}%`}
                icon={<ListCheck className="w-5 h-5" />}
                color="blue"
                sub="Completed tasks"
                link="/task?status=done"
            />
            <ActionCard
                label="Avg Issue Resolution"
                value={`${avg_issue_resolution_time}d`}
                icon={<Bug className="w-5 h-5" />}
                color="purple"
                sub="Days to close"
                link="/github-issue?state=closed"
            />
            <ActionCard
                label="Overdue Tasks"
                value={overdue_tasks}
                icon={<AlertCircle className="w-5 h-5" />}
                color={overdue_tasks > 0 ? 'red' : 'green'}
                sub={overdue_tasks > 0 ? 'Needs attention' : 'All on track'}
                link="/task?overdue=1"
            />

            {/* ========== ALERTS ========== */}
            <ActionCard
                label="Stale PRs (7+ days)"
                value={stale_prs}
                icon={<Clock className="w-5 h-5" />}
                color="yellow"
                sub="No activity in 7 days"
                link="/pull-request?stale=1"
            />
            <ActionCard
                label="PRs Needing Review"
                value={prs_needing_review}
                icon={<Eye className="w-5 h-5" />}
                color="blue"
                sub="Open PRs with 0 reviews"
                link="/pull-request?filter=open"
            />
            <ActionCard
                label="Inactive Devs (7+ days)"
                value={inactive_developers}
                icon={<Users className="w-5 h-5" />}
                color="red"
                sub="No commits in 7 days"
                link="/github-user?inactive=1"
            />
            <ActionCard
                label="PR Merge Rate"
                value={`${pr_merge_rate}%`}
                icon={<FileCheck className="w-5 h-5" />}
                color="green"
                sub={`${prs_merged} merged / ${prs_total} total`}
                link="/pull-request?state=merged"
            />
        </CardSectionWrapper>
    );
}