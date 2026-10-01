import type { DeveloperMetrics } from '@/types/metric';
import DeveloperRankingSection from './developer-ranking-section';
import DeveloperSummarySection from './developer-summary-section';
import ProjectsByDeveloperSection from './projects-by-developer-section';
import TasksByDeveloperSection from './tasks-by-developer-section';

interface DeveloperTabProps {
    metrics: DeveloperMetrics;
}

export default function DeveloperTab({ metrics }: DeveloperTabProps) {
    const { summary, ranking, tasks_by_developer, projects_by_developer } =
        metrics;

    return (
        <>
            <DeveloperSummarySection summary={summary} />
            <DeveloperRankingSection ranking={ranking} />
            <TasksByDeveloperSection tasks_by_developer={tasks_by_developer} />
            <ProjectsByDeveloperSection
                projects_by_developer={projects_by_developer}
            />
        </>
    );
}
