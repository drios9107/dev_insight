import { SectionTitle } from '@/components/custom/metrics';
import SimpleTable, {
    ISimpleTableColumn,
} from '@/components/custom/simple-table';
import { Card, CardContent } from '@/components/ui/card';
import type { ProjectWithStats } from '@/types/metric';

interface ProjectsOverviewSectionProps {
    projects: ProjectWithStats[];
}

export default function ProjectsOverviewSection({
    projects,
}: ProjectsOverviewSectionProps) {
    const columns: ISimpleTableColumn<ProjectWithStats>[] = [
        {
            key: 'name',
            label: 'Project',
            render: (value) => <span className="font-medium">{value}</span>,
        },
        {
            key: 'team',
            label: 'Team',
            render: (value) => (
                <span className="text-sm text-gray-600">{value || '-'}</span>
            ),
        },
        {
            key: 'developers_count',
            label: 'Developers',
            align: 'center',
        },
        {
            key: 'tasks_count',
            label: 'Tasks',
            align: 'center',
        },
        {
            key: 'sprints_count',
            label: 'Sprints',
            align: 'center',
        },
        {
            key: 'progress',
            label: 'Progress',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="h-2 min-w-[80px] flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-green-500 transition-all duration-500"
                            style={{ width: `${value}%` }}
                        />
                    </div>
                    <span className="w-10 text-right text-xs text-gray-500">
                        {value}%
                    </span>
                </div>
            ),
        },
    ];

    return (
        <>
            <SectionTitle title="📁 Projects Overview" className="mt-6" />
            <Card className="mb-6 overflow-hidden border-0 py-0 shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <SimpleTable
                            columns={columns}
                            data={projects}
                            emptyMessage="No projects found"
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
