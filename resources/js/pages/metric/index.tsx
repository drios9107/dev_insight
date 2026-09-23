import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/components/custom/header';
import BodyWrapper from '@/components/custom/body-wrapper';
import ShadSelect from '@/components/custom/inputs/shad-select';
import metric from '@/routes/metric';
import { RepositoryMetrics, ProjectMetrics, MetricsTab } from '@/types/metric';
import RepositoryTab from '@/components/custom/metrics/tabs/repository-tab';
import ProjectTab from '@/components/custom/metrics/tabs/project-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MetricsPageProps {
    repository_metrics: RepositoryMetrics;
    project_metrics: ProjectMetrics;
    repositories: Array<{ id: number; full_name: string }>;
    selected_repository: number | null;
    active_tab: MetricsTab;
    title: string;
}

export default function Metric({
    repository_metrics,
    project_metrics,
    repositories,
    selected_repository,
    active_tab,
    title,
}: MetricsPageProps) {
    const [selectedRepo, setSelectedRepo] = useState<string>(
        selected_repository ? String(selected_repository) : 'all'
    );
    const [activeTab, setActiveTab] = useState<MetricsTab>(active_tab);

    const handleRepoChange = (value: string) => {
        setSelectedRepo(value);
        router.get(
            window.location.pathname,
            { tab: activeTab, repository_id: value === 'all' ? null : value },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value as MetricsTab);
        router.get(
            window.location.pathname,
            { tab: value, repository_id: selectedRepo === 'all' ? null : selectedRepo },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <>
            <Head title={title} />
            <h1 className="sr-only">{title}</h1>
            <Header title={title}>
                <ShadSelect
                    label="Repository"
                    name="owner_id"
                    value={selectedRepo}
                    onChange={handleRepoChange}
                    list={repositories.map(i => ({ value: String(i.id), label: i.full_name }))}
                />
            </Header>

            <BodyWrapper>
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="repository">📊 By Repository</TabsTrigger>
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