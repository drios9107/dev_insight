import { Link } from '@inertiajs/react';
import CustomAvatar from '@/components/custom/custom-avatar';
import { SectionTitle } from '@/components/custom/metrics';
import NoItemAssignedCard from '@/components/custom/no-item-assigned-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectsByDeveloperRow } from '@/types/metric';

interface ProjectsByDeveloperSectionProps {
    projects_by_developer: ProjectsByDeveloperRow[];
}

export default function ProjectsByDeveloperSection({
    projects_by_developer,
}: ProjectsByDeveloperSectionProps) {
    return (
        <>
            <SectionTitle title="📁 Projects by Developer" className="mt-6" />
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {projects_by_developer.length === 0 ? (
                    <NoItemAssignedCard text="No projects assigned" />
                ) : (
                    projects_by_developer.map((dev) => (
                        <Card key={dev.id} className="border-0 shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <CustomAvatar
                                            src={dev.avatar ?? undefined}
                                            title={dev.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        />
                                        <span>{dev.name}</span>
                                    </div>
                                    <Badge variant="secondary">
                                        {dev.projects_count}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {dev.projects.length === 0 ? (
                                    <p className="py-2 text-center text-sm text-gray-400">
                                        No projects
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {dev.projects.map((project) => (
                                            <Link
                                                key={project.id}
                                                href={`/metric?tab=project&project_id=${project.id}`}
                                                className="transition-transform hover:scale-105"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-gray-100"
                                                >
                                                    {project.name}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </>
    );
}
