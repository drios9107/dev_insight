import { cn } from "@/lib/utils"
import CardSectionWrapper from "./section-components/card-section-wrapper"
import { GitCommit } from "lucide-react"
import commit from "@/routes/commit";
import pullRequest from "@/routes/pull-request";
import githubIssue from "@/routes/github-issue";
import pullRequestReview from "@/routes/pull-request-review";
import { IMetricCard } from "@/types/metric";
import { MetricCard } from "./section-components/metric-card";

const cardRoutes: Record<string, string> = {
    'Total Commits': commit.index().url,
    'Pull Requests': pullRequest.index().url,
    'Issues': githubIssue.index().url,
    'Reviews': pullRequestReview.index().url,
};

const MetricsSection = ({ cards }: { cards: IMetricCard[] }) => {
    return <CardSectionWrapper className="sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
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
    </CardSectionWrapper>
}

export default MetricsSection