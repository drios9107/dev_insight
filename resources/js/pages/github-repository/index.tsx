import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { IGithubRepository } from "@/types/models/github-repository";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import githubRepository from "@/routes/github-repository";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw } from "lucide-react";
import { SimpleModal } from "@/components/custom/simple-modal";
import ShadInput from "@/components/custom/inputs/shad-input";
import { Button } from "@/components/ui/button";

const GithubRepositories = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<IGithubRepository | null>(null)
    const [showSyncModal, setShowSyncModal] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [username, setUsername] = useState(props?.github_username ?? '')

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
            render: (value) => value ? new Date(value).toLocaleDateString() : 'Never',
        },
        {
            key: 'url',
            label: 'Link',
            align: 'center',
            render: (value: string) => (
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <ExternalLink className="w-4 h-4 inline" />
                    </a>
                ) : '-'
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
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: [
                { value: 'all', label: 'All' },
                { value: '1', label: 'Private' },
                { value: '0', label: 'Public' },
            ],
            addAll: false
        },
    ];

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(githubRepository.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Repository deleted successfully'),
                onError: (error) => toast.error(`Repository deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onClose = useCallback(() => setItemToDelete(null), [setItemToDelete])

    const handleSyncAll = useCallback(() => {
        if (!username.trim()) {
            toast.error('Please enter a GitHub username');
            return;
        }

        setIsSyncing(true);

        router.post(
            githubRepository.syncAll().url,
            { ownerKey: username },
            {
                onSuccess: () => {
                    toast.success('Repositories synced successfully');
                    setShowSyncModal(false);
                    router.reload();
                },
                onError: (errors) => {
                    if (errors.ownerKey) {
                        toast.error(errors.ownerKey);
                    } else {
                        toast.error('Sync failed');
                    }
                },
                onFinish: () => setIsSyncing(false),
            }
        );
    }, [username, setShowSyncModal, setIsSyncing]);

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} >
            <Button
                onClick={() => setShowSyncModal(true)}
                disabled={isSyncing}
                variant="outline"
                className="gap-2"
            >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync All Repos'}
            </Button>
        </Header>

        <BodyWrapper>
            <DataTable
                data={props.list}
                columns={columns}
                filters={filterOptions}
                initialFilters={props.filters}
                onDelete={setItemToDelete}
            />

            {itemToDelete && <DeleteModal onClose={onClose} onClick={onDelete} />}
        </BodyWrapper>

        {showSyncModal && (
            <SimpleModal
                title="Sync GitHub Repositories"
                description="Enter a GitHub username to sync all their repositories"
                onClose={() => setShowSyncModal(false)}
                onClick={handleSyncAll}
                isLoading={isSyncing}
                confirmText="Sync"
                height={null}
            >
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <ShadInput required label="Github username" name="github-username" value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isSyncing}
                            placeholder="drios9107"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSyncAll();
                            }}
                        />
                        <p className="text-xs text-gray-500">
                            This will fetch and sync all public and private repositories of the user
                        </p>
                    </div>
                </div>
            </SimpleModal>
        )}
    </>
}

export default GithubRepositories;