import { FolderKanban, Users, ListCheck, TrendingUp } from 'lucide-react';
import { ActionCard } from '@/components/custom/metrics';
import CardSectionWrapper from '@/components/custom/metrics/section-components/card-section-wrapper';
import type { ProjectSummary } from '@/types/metric';

interface ProjectSummarySectionProps {
    summary: ProjectSummary;
}

export default function ProjectSummarySection({
    summary,
}: ProjectSummarySectionProps) {
    return (
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
    );
}
