import { Users, GitCommit, UserCheck, UserX } from 'lucide-react';
import { ActionCard } from '@/components/custom/metrics';
import type { DeveloperSummary } from '@/types/metric';

interface DeveloperSummarySectionProps {
    summary: DeveloperSummary;
}

export default function DeveloperSummarySection({
    summary,
}: DeveloperSummarySectionProps) {
    return (
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
    );
}
