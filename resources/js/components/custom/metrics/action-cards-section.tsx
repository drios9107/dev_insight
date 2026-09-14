import CardSectionWrapper from "./section-components/card-section-wrapper"
import { AlertCircle, Clock, Eye, FileCheck, GitCommit } from "lucide-react"
import { ActionCard } from "./section-components/action-card";

interface IActionCardsSection {
    stale_prs: number,
    prs_needing_review: number,
    inactive_developers: number,
    pr_merge_rate: number,
    prs_merged: number,
    prs_total: number,
}

const ActionCardsSection = ({ stale_prs, prs_needing_review, inactive_developers, pr_merge_rate, prs_merged, prs_total }: IActionCardsSection) => {
    return <CardSectionWrapper className="sm:grid-cols-2 lg:grid-cols-4">
        <ActionCard
            label="Stale PRs (7+ days)"
            value={stale_prs}
            icon={<Clock className="w-5 h-5" />}
            color="yellow"
            sub="No activity in 7 days"
        />
        <ActionCard
            label="PRs Needing Review"
            value={prs_needing_review}
            icon={<Eye className="w-5 h-5" />}
            color="blue"
            sub="Open PRs with 0 reviews"
        />
        <ActionCard
            label="Inactive Devs (7+ days)"
            value={inactive_developers}
            icon={<AlertCircle className="w-5 h-5" />}
            color="red"
            sub="No commits in 7 days"
        />
        <ActionCard
            label="PR Merge Rate"
            value={`${pr_merge_rate}%`}
            icon={<FileCheck className="w-5 h-5" />}
            color="green"
            sub={`${prs_merged} merged / ${prs_total} total`}
        />
    </CardSectionWrapper>
}

export default ActionCardsSection