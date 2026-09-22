import { Head, router } from '@inertiajs/react';
import BodyWrapper from '@/components/custom/body-wrapper';
import Header from '@/components/custom/header';
import type { IColumn } from '@/components/custom/table/data-table';
import { DataTable } from '@/components/custom/table/data-table';
import { Badge } from '@/components/ui/badge';
import activityLog from '@/routes/activity-log';

const ActivityLogs = (props: any) => {
    const columns: IColumn[] = [
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (value: string) => (
                <Badge variant={getBadgeVariant(value)}>{value}</Badge>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            render: (value: string) => (
                <span className="block max-w-[200px] truncate">{value}</span>
            ),
        },
        {
            key: 'user',
            label: 'User',
            render: (value) => value?.name || '-',
        },
        {
            key: 'team',
            label: 'Team',
            render: (value) => value?.name || '-',
        },
        {
            key: 'project',
            label: 'Project',
            render: (value) => value?.name || '-',
        },
        {
            key: 'task',
            label: 'Task',
            render: (value) => (value?.title ? `#${value.id}` : '-'),
        },
        {
            key: 'created_at',
            label: 'Date',
            sortable: true,
            render: (value) => (value ? new Date(value).toLocaleString() : '-'),
        },
    ];

    const filterOptions = [
        {
            key: 'type',
            label: 'Type',
            value: props?.filters?.type ?? 'all',
            onChange: (value: string) => {
                router.get(
                    activityLog.index().url,
                    { ...props?.filters, type: value, page: 1 },
                    { preserveState: true, preserveScroll: true },
                );
            },
            options:
                props?.types?.map((type: string) => ({
                    value: type,
                    label: type.charAt(0).toUpperCase() + type.slice(1),
                })) || [],
            addAll: true,
        },
        {
            key: 'user_id',
            label: 'User',
            value: props?.filters?.user_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    activityLog.index().url,
                    { ...props?.filters, user_id: value, page: 1 },
                    { preserveState: true, preserveScroll: true },
                );
            },
            options:
                props?.users?.map((user: any) => ({
                    value: String(user.id),
                    label: user.name,
                })) || [],
            addAll: true,
        },
    ];

    const getBadgeVariant = (type: string) => {
        const mapping: Record<
            string,
            'default' | 'success' | 'warning' | 'destructive' | 'info'
        > = {
            created: 'success',
            updated: 'warning',
            deleted: 'destructive',
        };

        return mapping[type] || 'default';
    };

    return (
        <>
            <Head title={props.title} />
            <h1 className="sr-only">{props.title}</h1>
            <Header title={props.title} />
            <BodyWrapper>
                <DataTable
                    data={props.list}
                    columns={columns}
                    filters={filterOptions}
                    initialFilters={props.filters}
                />
            </BodyWrapper>
        </>
    );
};

export default ActivityLogs;
