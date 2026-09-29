import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import BodyWrapper from '@/components/custom/body-wrapper';
import Header from '@/components/custom/header';
import ShadSelect from '@/components/custom/inputs/shad-select';
import ProjectTab from '@/components/custom/metrics/tabs/project-tab';
import RepositoryTab from '@/components/custom/metrics/tabs/repository-tab';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import metric from '@/routes/metric';
import type {
    RepositoryMetrics,
    ProjectMetrics,
    MetricsTab,
} from '@/types/metric';

export interface MetricsPageProps {
    repository_metrics: RepositoryMetrics;
    project_metrics: ProjectMetrics;
    repositories: Array<{ id: number; full_name: string }>;
    projects: Array<{ id: number; name: string }>;
    selected_repository: number | null;
    selected_project: number | null;
    active_tab: MetricsTab;
    title: string;
}

export default function Metric({
    repository_metrics,
    project_metrics,
    repositories,
    projects,
    selected_repository,
    selected_project,
    active_tab,
    title,
}: MetricsPageProps) {
    const [selectedRepo, setSelectedRepo] = useState<string>(
        selected_repository ? String(selected_repository) : 'all',
    );
    const [selectedProj, setSelectedProj] = useState<string>(
        selected_project ? String(selected_project) : 'all',
    );
    const [activeTab, setActiveTab] = useState<MetricsTab>(active_tab);

    const handleRepoChange = (value: string) => {
        setSelectedRepo(value);
        router.get(
            window.location.pathname,
            {
                tab: activeTab,
                repository_id: value === 'all' ? null : value,
                project_id: selectedProj === 'all' ? null : selectedProj,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleProjectChange = (value: string) => {
        setSelectedProj(value);
        router.get(
            window.location.pathname,
            {
                tab: activeTab,
                repository_id: selectedRepo === 'all' ? null : selectedRepo,
                project_id: value === 'all' ? null : value,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value as MetricsTab);
        router.get(
            window.location.pathname,
            {
                tab: value,
                repository_id: selectedRepo === 'all' ? null : selectedRepo,
                project_id: selectedProj === 'all' ? null : selectedProj,
            },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title={title} />
            <h1 className="sr-only">{title}</h1>
            <Header title={title}>
                <div className="flex w-60 items-center gap-2">
                    {activeTab === 'repository' ? (
                        <>
                            <Label
                                htmlFor={'repository_id'}
                                className="font-normal"
                            >
                                Repository
                            </Label>
                            <ShadSelect
                                name="repository_id"
                                value={selectedRepo}
                                onChange={handleRepoChange}
                                list={repositories.map((i) => ({
                                    value: String(i.id),
                                    label: i.full_name,
                                }))}
                            />
                        </>
                    ) : (
                        <>
                            <Label
                                htmlFor={'project_id'}
                                className="font-normal"
                            >
                                Project
                            </Label>
                            <ShadSelect
                                name="project_id"
                                value={selectedProj}
                                onChange={handleProjectChange}
                                list={projects.map((i) => ({
                                    value: String(i.id),
                                    label: i.name,
                                }))}
                            />
                        </>
                    )}
                </div>
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
                    </TabsList>

                    <TabsContent value="repository">
                        <RepositoryTab metrics={repository_metrics} />
                    </TabsContent>

                    <TabsContent value="project">
                        <ProjectTab metrics={project_metrics} />
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
