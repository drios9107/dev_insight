import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import BodyWrapper from '@/components/custom/body-wrapper';
import { ActivityLogDetails } from '@/components/custom/details/activity-log-details';
import Header from '@/components/custom/header';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import { Badge } from '@/components/ui/badge';
import { ActivityLogTypeEnum } from '@/enums/activity-log';
import { getActivityLogTypeColor } from '@/lib/utils/activity-log';
import activityLog from '@/routes/activity-log';
import type {
    IActivityLogList,
    TActivityLogType,
} from '@/types/models/activity-log';

const ActivityLogs = (props: any) => {
    const [itemToViewId, setItemToViewId] = useState<number | null>(null);

    const columns: IColumn<IActivityLogList>[] = [
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (value: TActivityLogType) => (
                <Badge variant={getActivityLogTypeColor(value)}>
                    {ActivityLogTypeEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            render: (value: string) => (
                <span className="block max-w-full truncate">{value}</span>
            ),
        },
        {
            key: 'user',
            label: 'User',
            render: (value) => value?.name || '-',
            className: 'min-w-[180px]',
        },
        {
            key: 'created_at',
            label: 'Date',
            sortable: true,
            className: 'min-w-[200px]',
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

    const onCloseDetails = useCallback(() => {
        setItemToViewId(null);
    }, []);

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
                    onView={(item: IActivityLogList) =>
                        setItemToViewId(item?.id)
                    }
                />

                {itemToViewId && (
                    <ActivityLogDetails
                        itemId={itemToViewId}
                        onClose={onCloseDetails}
                    />
                )}
                {itemsToDelete && (
                    <DeleteModal
                        onClose={() => setItemsToDelete(null)}
                        onClick={onBulkDelete}
                    />
                )}
            </BodyWrapper>
        </>
    );
};

export default ActivityLogs;
