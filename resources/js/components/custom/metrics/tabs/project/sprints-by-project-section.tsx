import { SectionTitle } from '@/components/custom/metrics';
import { Badge } from '@/components/ui/badge';
import SimpleTable, {
    ISimpleTableColumn,
} from '@/components/custom/simple-table';
import type { SprintsByProject } from '@/types/metric';
import { Card, CardContent } from '@/components/ui/card';

interface SprintsByProjectSectionProps {
    sprints_by_project: SprintsByProject[];
}

export default function SprintsByProjectSection({
    sprints_by_project,
}: SprintsByProjectSectionProps) {
    const columns: ISimpleTableColumn<SprintsByProject>[] = [
        {
            key: 'project_name',
            label: 'Project',
            render: (value) => <span className="font-medium">{value}</span>,
        },
        {
            key: 'total_sprints',
            label: 'Total',
            align: 'center',
        },
        {
            key: 'active_sprints',
            label: 'Active',
            align: 'center',
            render: (value) => <Badge variant="info">{value}</Badge>,
        },
        {
            key: 'completed_sprints',
            label: 'Completed',
            align: 'center',
            render: (value) => <Badge variant="success">{value}</Badge>,
        },
    ];

    return (
        <>
            <SectionTitle title="🏃 Sprints by Project" className="mt-6" />
            <Card className="mb-6 overflow-hidden border-0 py-0 shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <SimpleTable
                            columns={columns}
                            data={sprints_by_project}
                            emptyMessage="No sprints found"
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
