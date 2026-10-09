import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import BodyWrapper from '@/components/custom/body-wrapper';
import CustomAvatar from '@/components/custom/custom-avatar';
import { DeleteModal } from '@/components/custom/delete-modal';
import { GithubUserDetails } from '@/components/custom/details/github-user-details';
import Header from '@/components/custom/header';
import ImportGithubUserModal from '@/components/custom/modals/import-github-user-modal';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import type { ICheck } from '@/components/custom/table/data-table-filters';
import { Button } from '@/components/ui/button';
import githubUser from '@/routes/github-user';
import type { IGithubUser, IGithubUserList } from '@/types/models/github-user';

const GithubUsers = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [itemToViewId, setItemToViewId] = useState<number | null>(null);

    const columns: IColumn<IGithubUserList>[] = [
        {
            key: 'avatar_url',
            label: 'Avatar',
            align: 'center',
            render: (value: string, row: IGithubUser) => (
                <CustomAvatar
                    src={value ?? undefined}
                    title={row.display_name?.charAt(0)?.toUpperCase() ?? 'U'}
                    className="h-8 w-8"
                />
            ),
        },
        {
            key: 'display_name',
            label: 'Name',
            sortable: true,
            render: (value: string, row: IGithubUser) => (
                <div className="min-w-[250px]">
                    <p className="font-medium">{value}</p>
                    <p className="text-xs text-gray-400">@{row.username}</p>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            render: (value: string) => value || '-',
        },
        {
            key: 'commits_count',
            label: 'Commits',
            align: 'center',
            render: (value: number) => value ?? 0,
        },
        {
            key: 'prs_count',
            label: 'PRs',
            align: 'center',
            render: (value: number) => value ?? 0,
        },
        {
            key: 'reviews_count',
            label: 'Reviews',
            align: 'center',
            render: (value: number) => value ?? 0,
        },
        {
            key: 'last_synced_at',
            label: 'Last Synced',
            sortable: true,
            render: (value: string) => value ?? 'Never',
            className: 'min-w-[200px]',
        },
    ];

    const checksOptions: ICheck[] = [
        {
            key: 'inactive',
            label: 'Inactive (7+ days)',
            value: props?.filters?.inactive,
            onChange: (value: boolean) => {
                router.get(
                    githubUser.index().url,
                    {
                        ...props?.filters,
                        inactive: value ? 1 : undefined,
                        page: 1,
                    },
                    { preserveState: true, preserveScroll: true },
                );
            },
        },
    ];

    const onSync = useCallback((item: IGithubUser) => {
        router.post(
            githubUser.sync(item.id).url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Synced'),
                onError: (errors) => toast.error(errors.sync || 'Sync failed'),
            },
        );
    }, []);

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(githubUser.destroy(itemToDelete).url, {
                onSuccess: () =>
                    toast.success('GitHub user deleted successfully'),
                onError: (error) =>
                    toast.error(`Deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null),
            });
        }
    }, [itemToDelete]);

    const onClose = useCallback(() => {
        setItemToDelete(null);
    }, [setItemToDelete]);

    const onBulkDelete = useCallback((ids: (number | string)[]) => {
        if (
            !confirm(`Are you sure you want to delete ${ids.length} record(s)?`)
        )
            return;

        router.delete(githubUser.bulkDestroy().url, {
            data: { ids },
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Records deleted');
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                toast.error(first ?? 'Error deleting records');
            },
        });
    }, []);

    return (
        <>
            <Head title={props.title} />
            <h1 className="sr-only">{props.title}</h1>
            <Header title={props.title}>
                <Button
                    onClick={() => setShowImportModal(true)}
                    className="gap-2"
                    variant="outline"
                >
                    <Plus className="h-4 w-4" />
                    Import
                </Button>
            </Header>
            <BodyWrapper>
                <DataTable
                    data={props.list}
                    columns={columns}
                    checks={checksOptions}
                    initialFilters={props.filters}
                    onSync={onSync}
                    onView={(item) => setItemToViewId(item?.id)}
                    onDelete={setItemToDelete}
                    onBulkDelete={onBulkDelete}
                    selectable
                />

                {itemToViewId && (
                    <GithubUserDetails
                        itemId={itemToViewId}
                        onClose={() => setItemToViewId(null)}
                    />
                )}
                {showImportModal && (
                    <ImportGithubUserModal
                        onClose={() => setShowImportModal(false)}
                        onSuccess={() => router.reload()}
                    />
                )}
                {itemToDelete && (
                    <DeleteModal onClose={onClose} onClick={onDelete} />
                )}
            </BodyWrapper>
        </>
    );
};

export default GithubUsers;
