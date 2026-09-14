import CardSectionWrapper from "./section-components/card-section-wrapper"
import { GitCommit, Star } from "lucide-react"
import { RankingCard } from "./section-components/ranking-card";
import { TopCommitter, TopContributor } from "@/types/metric";
import { useMemo } from "react";

interface IRankingCardsSection {
    top_contributors: TopContributor[];
    top_committers: TopCommitter[];
}

const RankingCardsSection = ({ top_contributors = [], top_committers = [] }: IRankingCardsSection) => {

    const topContributorsList = useMemo(() => {
        return top_contributors?.map((c: any) => ({
            name: c.name,
            username: c.username,
            avatar: c.avatar,
            value: c.score,
            label: 'points',
        }))
    }, [top_contributors])

    const topCommittersList = useMemo(() => {
        return top_committers?.map((c: any) => ({
            name: c.name,
            username: c.username,
            avatar: c.avatar,
            value: c.commits,
            label: 'commits',
        }))
    }, [top_committers])

    return <CardSectionWrapper className="lg:grid-cols-2 gap-6">
        <RankingCard
            title="🏆 Top Contributors"
            icon={<Star className="w-4 h-4" />}
            items={topContributorsList}
        />
        <RankingCard
            title="⚡ Most Commits"
            icon={<GitCommit className="w-4 h-4" />}
            items={topCommittersList}
        />
    </CardSectionWrapper>
}

export default RankingCardsSection