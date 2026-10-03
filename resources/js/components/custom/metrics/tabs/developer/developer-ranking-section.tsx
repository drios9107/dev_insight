import CustomAvatar from '@/components/custom/custom-avatar';
import { SectionTitle } from '@/components/custom/metrics';
import type { ISimpleTableColumn } from '@/components/custom/simple-table';
import SimpleTable from '@/components/custom/simple-table';
import { Card, CardContent } from '@/components/ui/card';
import type { DeveloperRankingRow } from '@/types/metric';

interface DeveloperRankingSectionProps {
    ranking: DeveloperRankingRow[];
}

export default function DeveloperRankingSection({
    ranking,
}: DeveloperRankingSectionProps) {
    const columns: ISimpleTableColumn<DeveloperRankingRow>[] = [
        {
            key: 'name',
            label: 'Developer',
            render: (_, dev) => (
                <div className="flex items-center gap-3">
                    <CustomAvatar
                        src={dev.avatar ?? undefined}
                        title={dev.name.charAt(0).toUpperCase()}
                        className="h-8 w-8"
                    />
                    <div>
                        <p className="text-sm font-medium">{dev.name}</p>
                        <p className="text-xs text-gray-400">@{dev.username}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'commits',
            label: 'Commits',
            align: 'center',
        },
        {
            key: 'prs',
            label: 'PRs',
            align: 'center',
        },
        {
            key: 'reviews',
            label: 'Reviews',
            align: 'center',
        },
        {
            key: 'issues',
            label: 'Issues',
            align: 'center',
        },
        {
            key: 'tasks_total',
            label: 'Tasks',
            align: 'center',
            render: (_, dev) => (
                <>
                    <span className="font-medium">{dev.tasks_total}</span>
                    <span className="ml-1 text-xs text-gray-400">
                        ({dev.tasks_open} open)
                    </span>
                </>
            ),
        },
        {
            key: 'projects',
            label: 'Projects',
            align: 'center',
        },
    ];

    return (
        <>
            <SectionTitle title="🏆 Developer Ranking" className="mt-6" />
            <Card className="mb-6 overflow-hidden border-0 py-0 shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <SimpleTable
                            columns={columns}
                            data={ranking}
                            emptyMessage="No developers found"
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
