import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import BodyWrapper from '@/components/custom/body-wrapper';
import { DeleteModal } from '@/components/custom/delete-modal';
import Header from '@/components/custom/header';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import commit from '@/routes/commit';

const Commits = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemsToDelete, setItemsToDelete] = useState<
        (string | number)[] | null
    >(null);

    const columns: IColumn[] = [
        {
            key: 'sha',
            label: 'SHA',
            render: (value: string) => (
                <span className="font-mono text-xs">
                    {value.substring(0, 7)}
                </span>
            ),
        },
        {
            key: 'message',
            label: 'Message',
            render: (value: string) => (
                <span className="block max-w-[200px] truncate">{value}</span>
            ),
        },
        {
            key: 'author',
            label: 'Author',
            render: (value) => value?.name || '-',
            className: 'min-w-[180px]',
        },
        {
            key: 'github_repository',
            label: 'Repository',
            render: (value) => value?.full_name || '-',
            className: 'min-w-[200px]',
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (value) => value ?? '-',
            className: 'min-w-[125px]',
        },
        {
            key: 'pull_request',
            label: 'PR',
            render: (value) =>
                value?.title ? `#${value.number} - ${value.title}` : '-',
            className: 'min-w-[200px]',
        },
    ];

    const filterOptions = [
        {
            key: 'repository_id',
            label: 'Repository',
            value: props?.filters?.repository_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    commit.index().url,
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
        {
            key: 'pull_request_id',
            label: 'PR',
            value: props?.filters?.pull_request_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    commit.index().url,
                    { ...props?.filters, pull_request_id: value, page: 1 },
                    { preserveState: true, preserveScroll: true },
                );
            },
            options:
                props?.pull_requests?.map((pr: any) => ({
                    value: String(pr.id),
                    label: `#${pr.number} - ${pr.title}`,
                })) || [],
            addAll: true,
        },
    ];

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(commit.destroy(itemToDelete).url, {
                onSuccess: () => toast.success('Commit deleted successfully'),
                onError: (error) =>
                    toast.error(`Commit deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null),
            });
        }
    }, [itemToDelete]);

    const onClose = useCallback(() => setItemToDelete(null), [setItemToDelete]);

    const onBulkDelete = useCallback(() => {
        router.delete(commit.bulkDestroy().url, {
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
                    onBulkDelete={onBulkDelete}
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

export default Commits;
