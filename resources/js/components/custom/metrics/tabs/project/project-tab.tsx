import type { ProjectMetrics } from '@/types/metric';
import DevelopersByProjectSection from './developers-by-project-section';
import ProjectsOverviewSection from './project-overview-section';
import ProjectSummarySection from './project-summary-section';
import SprintsByProjectSection from './sprints-by-project-section';
import TasksDistributionSection from './task-distribution-section';

interface ProjectTabProps {
    metrics: ProjectMetrics;
}

export default function ProjectTab({ metrics }: ProjectTabProps) {
    const {
        summary,
        projects,
        developers_by_project,
        tasks_distribution,
        sprints_by_project,
    } = metrics;

    return (
        <>
            <ProjectSummarySection summary={summary} />
            <ProjectsOverviewSection projects={projects} />
            <DevelopersByProjectSection
                developers_by_project={developers_by_project}
            />
            <TasksDistributionSection tasks_distribution={tasks_distribution} />
            <SprintsByProjectSection sprints_by_project={sprints_by_project} />
        </>
    );
}
