import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import BodyWrapper from '@/components/custom/body-wrapper';
import { DeleteModal } from '@/components/custom/delete-modal';
import Header from '@/components/custom/header';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import { Badge } from '@/components/ui/badge';
import { GithubIssueStateEnum } from '@/enums/githubs-issue';
import githubIssue from '@/routes/github-issue';
import type { TGithubsIssueState } from '@/types/models/github-issue';

const GithubsIssues = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemsToDelete, setItemsToDelete] = useState<
        (string | number)[] | null
    >(null);

    const columns: IColumn[] = [
        {
            key: 'number',
            label: '#',
            sortable: true,
            align: 'center',
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
            render: (value: TGithubsIssueState) => (
                <Badge variant={getBadgeColor(value)}>
                    {GithubIssueStateEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'author',
            label: 'Author',
            render: (value) => value?.name || '-',
        },
        {
            key: 'github_id',
            label: 'GitHub ID',
            render: (value) => value || '-',
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            render: (value) => value ?? '-',
            className: 'min-w-[125px]',
        },
        {
            key: 'closed_at',
            label: 'Closed',
            sortable: true,
            render: (value) => value ?? '-',
            className: 'min-w-[125px]',
        },
        {
            key: 'task',
            label: 'Task',
            render: (value) => value?.title ?? '-',
            className: 'min-w-[250px]',
        },
    ];

    const filterOptions = [
        {
            key: 'state',
            label: 'State',
            value: props?.filters?.state ?? 'all',
            onChange: (value: string) => {
                router.get(
                    githubIssue.index().url,
                    { ...props?.filters, state: value, page: 1 },
                    { preserveState: true, preserveScroll: true },
                );
            },
            options: Object.keys(GithubIssueStateEnum).map((i) => ({
                value: i,
                label: GithubIssueStateEnum[i as TGithubsIssueState],
            })),
            addAll: true,
        },
        {
            key: 'repository_id',
            label: 'Repository',
            value: props?.filters?.repository_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    githubIssue.index().url,
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

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(githubIssue.destroy(itemToDelete).url, {
                onSuccess: () => toast.success('Issue deleted successfully'),
                onError: (error) =>
                    toast.error(`Issue deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null),
            });
        }
    }, [itemToDelete]);

    const onClose = useCallback(() => {
        setItemToDelete(null);
    }, [setItemToDelete]);

    const onBulkDelete = useCallback(() => {
        router.delete(githubIssue.bulkDestroy().url, {
            data: { ids: itemsToDelete },
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Records deleted');
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                toast.error(first ?? 'Error deleting records');
            },
        });
    }, [itemsToDelete]);

    const getBadgeColor = useCallback((status: TGithubsIssueState) => {
        const mapping = {
            open: 'warning',
            closed: 'secondary',
        };

        return mapping[status] as 'warning' | 'secondary';
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
                    onDelete={setItemToDelete}
                    onBulkDelete={setItemsToDelete}
                    selectable
                />

                {itemToDelete && (
                    <DeleteModal onClose={onClose} onClick={onDelete} />
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

export default GithubsIssues;
