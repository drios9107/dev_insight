import { Head, router } from '@inertiajs/react';
import { ExternalLink, Plus, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import BodyWrapper from '@/components/custom/body-wrapper';
import { DeleteModal } from '@/components/custom/delete-modal';
import Header from '@/components/custom/header';
import ImportGithubRepositoryModal from '@/components/custom/modals/import-github-repository-modal';
import SyncAllRepositoriesModal from '@/components/custom/modals/sync-all-repositories-modal';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import githubRepository from '@/routes/github-repository';

const GithubRepositories = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showSyncModal, setShowSyncModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    const columns: IColumn[] = [
        {
            key: 'full_name',
            label: 'Repository',
            sortable: true,
        },
        {
            key: 'is_private',
            label: 'Visibility',
            sortable: true,
            render: (value: boolean) => (
                <Badge variant={value ? 'secondary' : 'success'}>
                    {value ? 'Private' : 'Public'}
                </Badge>
            ),
        },
        {
            key: 'default_branch',
            label: 'Branch',
            render: (value: string) => value || 'main',
        },
        {
            key: 'last_synced_at',
            label: 'Last Synced',
            sortable: true,
            className: 'min-w-[125px]',
            render: (value) => value ?? 'Never',
        },
        {
            key: 'url',
            label: 'Link',
            align: 'center',
            render: (value: string) =>
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <ExternalLink className="inline h-4 w-4" />
                    </a>
                ) : (
                    '-'
                ),
        },
    ];

    const filterOptions = [
        {
            key: 'is_private',
            label: 'Visibility',
            value: props?.filters?.is_private ?? 'all',
            onChange: (value: string) => {
                router.get(
                    githubRepository.index().url,
                    { ...props?.filters, is_private: value, page: 1 },
                    { preserveState: true, preserveScroll: true },
                );
            },
            options: [
                { value: 'all', label: 'All' },
                { value: '1', label: 'Private' },
                { value: '0', label: 'Public' },
            ],
            addAll: false,
        },
    ];

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(githubRepository.destroy(itemToDelete).url, {
                onSuccess: () =>
                    toast.success('Repository deleted successfully'),
                onError: (error) =>
                    toast.error(
                        `Repository deletion failed: ${error?.message}`,
                    ),
                onFinish: () => setItemToDelete(null),
            });
        }
    }, [itemToDelete]);

    const onClose = useCallback(() => setItemToDelete(null), [setItemToDelete]);

    return (
        <>
            <Head title={props.title} />
            <h1 className="sr-only">{props.title}</h1>
            <Header title={props.title}>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setShowImportModal(true)}
                        variant="outline"
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Import Repository
                    </Button>
                    <Button
                        onClick={() => setShowSyncModal(true)}
                        variant="outline"
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Sync All Repos
                    </Button>
                </div>
            </Header>

            <BodyWrapper>
                <DataTable
                    data={props.list}
                    columns={columns}
                    filters={filterOptions}
                    initialFilters={props.filters}
                    onDelete={setItemToDelete}
                />

                {itemToDelete && (
                    <DeleteModal onClose={onClose} onClick={onDelete} />
                )}
            </BodyWrapper>

            {showSyncModal && (
                <SyncAllRepositoriesModal
                    defaultUsername={props?.github_username ?? ''}
                    onClose={() => setShowSyncModal(false)}
                    onSuccess={() => router.reload()}
                />
            )}

            {showImportModal && (
                <ImportGithubRepositoryModal
                    onClose={() => setShowImportModal(false)}
                    onSuccess={() => router.reload()}
                />
            )}
        </>
    );
};

export default GithubRepositories;
