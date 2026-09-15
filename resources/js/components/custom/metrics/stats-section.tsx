import { ActionCard } from './section-components/action-card';
import { GitCommit, Clock, Bug, Users, FolderKanban, ListStart, ListCheck, Eye } from 'lucide-react';
import CardSectionWrapper from './section-components/card-section-wrapper';

interface StatsSectionProps {
    // Key Metrics
    active_developers: number;
    avg_commits_per_day: number;
    avg_issue_close_time: number;
    avg_pr_merge_time: number;
    // stats
    active_projects: number;
    total_projects: number;
    active_sprints: number;
    total_sprints: number;
    open_issues: number;
    total_issues: number;
    tasks_in_progress: number;
    tasks_in_review: number;
    total_tasks: number;
}

export default function StatsSection({
    active_developers,
    avg_commits_per_day,
    avg_issue_close_time,
    avg_pr_merge_time,
    active_projects,
    total_projects,
    active_sprints,
    total_sprints,
    open_issues,
    total_issues,
    tasks_in_progress,
    tasks_in_review,
    total_tasks,
}: StatsSectionProps) {
    return (
        <CardSectionWrapper className="sm:grid-cols-2 lg:grid-cols-4">
            {/* Key Metrics */}
            <ActionCard label="Avg Commits/Day" value={avg_commits_per_day} icon={<GitCommit className="w-5 h-5" />} color="blue" sub="Last 30 days" />
            <ActionCard label="Avg PR Merge Time" value={`${avg_pr_merge_time}h`} icon={<Clock className="w-5 h-5" />} color="green" sub="Time to merge" />
            <ActionCard label="Avg Issue Close Time" value={`${avg_issue_close_time}d`} icon={<Bug className="w-5 h-5" />} color="purple" sub="Days to close" />
            <ActionCard label="Active Developers" value={active_developers} icon={<Users className="w-5 h-5" />} color="yellow" sub="Last 30 days" />

            {/* Stats Overview */}
            <ActionCard label="Active Projects" value={`${active_projects} / ${total_projects}`} icon={<FolderKanban className="w-5 h-5" />} color="blue" sub="Total projects" />
            <ActionCard label="Active Sprints" value={`${active_sprints} / ${total_sprints}`} icon={<ListStart className="w-5 h-5" />} color="purple" sub="Total sprints" />
            <ActionCard label="Open Issues" value={`${open_issues} / ${total_issues}`} icon={<Bug className="w-5 h-5" />} color="red" sub="Total issues" />
            <ActionCard label="Tasks In Progress" value={`${tasks_in_progress} / ${total_tasks}`} icon={<ListCheck className="w-5 h-5" />} color="yellow" sub="Total tasks" />
            <ActionCard label="Tasks In Review" value={`${tasks_in_review} / ${total_tasks}`} icon={<Eye className="w-5 h-5" />} color="green" sub="Total tasks" />
        </CardSectionWrapper>
    );
}