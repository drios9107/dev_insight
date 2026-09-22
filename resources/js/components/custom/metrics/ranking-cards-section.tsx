import { GitCommit, Star } from 'lucide-react';
import { useMemo } from 'react';
import type { TopCommitter, TopContributor } from '@/types/metric';
import CardSectionWrapper from './section-components/card-section-wrapper';
import { RankingCard } from './section-components/ranking-card';

interface IRankingCardsSection {
    top_contributors: TopContributor[];
    top_committers: TopCommitter[];
}

const RankingCardsSection = ({
    top_contributors = [],
    top_committers = [],
}: IRankingCardsSection) => {
    const topContributorsList = useMemo(() => {
        return top_contributors?.map((c: any) => ({
            name: c.name,
            username: c.username,
            avatar: c.avatar,
            value: c.score,
            label: 'points',
        }));
    }, [top_contributors]);

    const topCommittersList = useMemo(() => {
        return top_committers?.map((c: any) => ({
            name: c.name,
            username: c.username,
            avatar: c.avatar,
            value: c.commits,
            label: 'commits',
        }));
    }, [top_committers]);

    return (
        <CardSectionWrapper className="gap-6 lg:grid-cols-2">
            <RankingCard
                title="🏆 Top Contributors"
                icon={<Star className="h-4 w-4" />}
                items={topContributorsList}
            />
            <RankingCard
                title="⚡ Most Commits"
                icon={<GitCommit className="h-4 w-4" />}
                items={topCommittersList}
            />
        </CardSectionWrapper>
    );
};

export default RankingCardsSection;
