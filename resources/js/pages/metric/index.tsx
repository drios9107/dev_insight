import { Head, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import BodyWrapper from '@/components/custom/body-wrapper';
import Header from '@/components/custom/header';
import DeveloperTab from '@/components/custom/metrics/tabs/developer-tab';
import ProjectTab from '@/components/custom/metrics/tabs/project-tab';
import RepositoryTab from '@/components/custom/metrics/tabs/repository-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import metric from '@/routes/metric';
import type {
    RepositoryMetrics,
    ProjectMetrics,
    MetricsTab,
    DeveloperMetrics,
} from '@/types/metric';
import type { IGithubUser } from '@/types/models/github-user';
import TabSelector, {
    ITabSelector,
} from '@/components/custom/metrics/tabs/tab-selector';

export interface MetricsPageProps {
    repository_metrics: RepositoryMetrics;
    project_metrics: ProjectMetrics;
    developer_metrics: DeveloperMetrics;
    repositories: Array<{ id: number; full_name: string }>;
    projects: Array<{ id: number; name: string }>;
    developers: Pick<IGithubUser, 'id' | 'display_name'>[];
    selected_repository: number | null;
    selected_project: number | null;
    selected_developer: number | null;
    active_tab: MetricsTab;
    title: string;
}

export default function Metric({
    repository_metrics,
    project_metrics,
    developer_metrics,
    repositories,
    projects,
    developers,
    selected_repository,
    selected_project,
    selected_developer,
    active_tab,
    title,
}: MetricsPageProps) {
    const [selectedRepo, setSelectedRepo] = useState<string>(
        selected_repository ? String(selected_repository) : 'all',
    );
    const [selectedProj, setSelectedProj] = useState<string>(
        selected_project ? String(selected_project) : 'all',
    );
    const [selectedDev, setSelectedDev] = useState<string>(
        selected_developer ? String(selected_developer) : 'all',
    );
    const [activeTab, setActiveTab] = useState<MetricsTab>(active_tab);

    const navigate = useCallback(
        (tab: MetricsTab, params: Record<string, string | null>) => {
            router.get(
                window.location.pathname,
                { tab, ...params },
                { preserveScroll: true },
            );
        },
        [],
    );

    const handleRepoChange = useCallback(
        (value: string) => {
            setSelectedRepo(value);
            navigate('repository', {
                repository_id: value === 'all' ? null : value,
            });
        },
        [navigate],
    );

    const handleProjectChange = useCallback(
        (value: string) => {
            setSelectedProj(value);
            navigate('project', {
                project_id: value === 'all' ? null : value,
            });
        },
        [navigate],
    );

    const handleDeveloperChange = useCallback(
        (value: string) => {
            setSelectedDev(value);
            navigate('developer', {
                developer_id: value === 'all' ? null : value,
            });
        },
        [navigate],
    );

    const handleTabChange = useCallback(
        (value: string) => {
            setActiveTab(value as MetricsTab);
            navigate(value as MetricsTab, {});
        },
        [navigate],
    );

    const repositoriesList = useMemo(
        () =>
            repositories.map((i) => ({
                value: String(i.id),
                label: i.full_name,
            })),
        [repositories],
    );

    const projectsList = useMemo(
        () => projects.map((i) => ({ value: String(i.id), label: i.name })),
        [projects],
    );

    const developersList = useMemo(
        () =>
            developers.map((i) => ({
                value: String(i.id),
                label: i.display_name,
            })),
        [developers],
    );

    const selectors = useMemo<Record<MetricsTab, ITabSelector>>(
        () => ({
            repository: {
                id: 'repository_id',
                label: 'Repository',
                value: selectedRepo,
                onChange: handleRepoChange,
                list: repositoriesList,
            },
            project: {
                id: 'project_id',
                label: 'Project',
                value: selectedProj,
                onChange: handleProjectChange,
                list: projectsList,
            },
            developer: {
                id: 'developer_id',
                label: 'Developer',
                value: selectedDev,
                onChange: handleDeveloperChange,
                list: developersList,
            },
        }),
        [
            selectedRepo,
            selectedProj,
            selectedDev,
            handleRepoChange,
            handleProjectChange,
            handleDeveloperChange,
            repositoriesList,
            projectsList,
            developersList,
        ],
    );

    return (
        <>
            <Head title={title} />
            <h1 className="sr-only">{title}</h1>

            <Header title={title}>
                <TabSelector selector={selectors[activeTab]} />
            </Header>

            <BodyWrapper>
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="w-full"
                >
                    <TabsList className="mb-6">
                        <TabsTrigger value="repository">
                            📊 By Repository
                        </TabsTrigger>
                        <TabsTrigger value="project">📁 By Project</TabsTrigger>
                        <TabsTrigger value="developer">
                            👥 By Developer
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="repository">
                        <RepositoryTab metrics={repository_metrics} />
                    </TabsContent>

                    <TabsContent value="project">
                        <ProjectTab metrics={project_metrics} />
                    </TabsContent>

                    <TabsContent value="developer">
                        <DeveloperTab metrics={developer_metrics} />
                    </TabsContent>
                </Tabs>
            </BodyWrapper>
        </>
    );
}

Metric.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: metric.index(),
        },
    ],
};
