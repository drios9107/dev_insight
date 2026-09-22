import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import BodyWrapper from '@/components/custom/body-wrapper';
import { DeleteModal } from '@/components/custom/delete-modal';
import Header from '@/components/custom/header';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import type { ICheck } from '@/components/custom/table/data-table-filters';
import { CustomTooltip } from '@/components/custom/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PullRequestStateEnum } from '@/enums/pull-requests';
import pullRequest from '@/routes/pull-request';
import type {
    IPullRequest,
    TPullRequestState,
} from '@/types/models/pull-request';

const PullRequests = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<IPullRequest | null>(null);

    const columns: IColumn[] = [
        {
            key: 'number',
            label: '#',
            sortable: true,
            align: 'center',
            render: (value: number) => `#${value}`,
        },
        {
            key: 'title',
            label: 'Title',
            sortable: true,
            render: (value: string) => (
                <span className="block max-w-[200px] truncate">{value}</span>
            ),
        },
        {
            key: 'state',
            label: 'State',
            sortable: true,
            render: (value: TPullRequestState) => (
                <Badge variant={getBadgeColor(value)}>
                    {PullRequestStateEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'author',
            label: 'Author',
            render: (value) => value?.username || '-',
        },
        {
            key: 'assignees',
            label: 'Assignees',
            render: (value) => {
                if (!value || value.length === 0) {
                    return '-';
                }

                return (
                    <div className="flex -space-x-2">
                        {value.slice(0, 3).map((user: any) => (
                            <CustomTooltip key={user.id} text={user.name}>
                                <Avatar
                                    key={user.id}
                                    className="h-6 w-6 border-2 border-white"
                                >
                                    <AvatarFallback className="text-xs">
                                        {user.name?.charAt(0).toUpperCase() ||
                                            'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </CustomTooltip>
                        ))}
                        {value.length > 3 && (
                            <span className="ml-1 text-xs text-gray-500">
                                +{value.length - 3}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'github_repository',
            label: 'Repository',
            render: (value) => value?.name || '-',
        },
        {
            key: 'base_branch',
            label: 'Base',
            render: (value) => value || '-',
        },
        {
            key: 'head_branch',
            label: 'Head',
            render: (value) => value || '-',
        },
        {
            key: 'task',
            label: 'Task',
            render: (value) => (value?.title ? `#${value.id}` : '-'),
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            render: (value) => value ?? '-',
        },
        {
            key: 'closed_at',
            label: 'Closed',
            sortable: true,
            render: (value) => value ?? '-',
        },
        {
            key: 'merged_at',
            label: 'Merged',
            sortable: true,
            render: (value) => value ?? '-',
        },
    ];

    const filterOptions = [
        {
            key: 'state',
            label: 'State',
            value: props?.filters?.state ?? 'all',
            onChange: (value: string) => {
                router.get(
                    pullRequest.index().url,
                    { ...props?.filters, state: value, page: 1 },
                    { preserveState: true, preserveScroll: true },
                );
            },
            options: Object.keys(PullRequestStateEnum).map((i) => ({
                value: i,
                label: PullRequestStateEnum[i as TPullRequestState],
            })),
            addAll: true,
        },
        {
            key: 'repository_id',
            label: 'Repository',
            value: props?.filters?.repository_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    pullRequest.index().url,
                    { ...props?.filters, repository_id: value, page: 1 },
                    { preserveState: true, preserveScroll: true },
                );
            },
            options:
                props?.repositories?.map((repo: any) => ({
                    value: String(repo.id),
                    label: repo.full_name,
                })) || [],
            addAll: true,
        },
    ];

    const checksOptions: ICheck[] = [
        {
            key: 'stale',
            label: 'Stale (7+ days)',
            value: props?.filters?.stale,
            onChange: (value: boolean) => {
                router.get(
                    pullRequest.index().url,
                    {
                        ...props?.filters,
                        stale: value ? 1 : undefined,
                        page: 1,
                    },
                    { preserveState: true, preserveScroll: true },
                );
            },
        },
    ];

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(pullRequest.destroy(itemToDelete!.id).url, {
                onSuccess: () =>
                    toast.success('Pull Request deleted successfully'),
                onError: (error) =>
                    toast.error(
                        `Pull Request deletion failed: ${error?.message}`,
                    ),
                onFinish: () => setItemToDelete(null),
            });
        }
    }, [itemToDelete]);

    const onClose = useCallback(() => {
        setItemToDelete(null);
    }, [setItemToDelete]);

    const getBadgeColor = useCallback((item: TPullRequestState) => {
        const mapping = {
            open: 'default',
            closed: 'secondary',
            merged: 'success',
        };

        return mapping[item] as 'default' | 'secondary' | 'success';
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
                    checks={checksOptions}
                    initialFilters={props.filters}
                    onDelete={setItemToDelete}
                />

                {itemToDelete && (
                    <DeleteModal onClose={onClose} onClick={onDelete} />
                )}
            </BodyWrapper>
        </>
    );
};

export default PullRequests;
