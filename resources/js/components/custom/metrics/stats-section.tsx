import { cn } from "@/lib/utils"
import CardSectionWrapper from "./card-section-wrapper"
import { GitCommit } from "lucide-react"
import commit from "@/routes/commit";
import pullRequest from "@/routes/pull-request";
import githubIssue from "@/routes/github-issue";
import pullRequestReview from "@/routes/pull-request-review";
import { IMetricCard } from "@/types/metric";
import { MetricCard } from "./section-components/metric-card";
import { StatCard } from "./section-components/stat-card";

interface IStatsSectionProps {
    avg_commits_per_day: number;
    avg_pr_merge_time: number;
    avg_issue_close_time: number;
    active_developers: number;
}

const StatsSection = ({ avg_commits_per_day, avg_pr_merge_time, avg_issue_close_time, active_developers }: IStatsSectionProps) => {
    return <CardSectionWrapper className="sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg Commits/Day" value={avg_commits_per_day} />
        <StatCard label="Avg PR Merge Time" value={`${avg_pr_merge_time}h`} />
        <StatCard label="Avg Issue Close Time" value={`${avg_issue_close_time}d`} />
        <StatCard label="Active Developers (30d)" value={active_developers} />
    </CardSectionWrapper>
}

export default StatsSection