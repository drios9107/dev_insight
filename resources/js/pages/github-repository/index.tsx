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
import { ExternalLink } from "lucide-react";

const GithubRepositorys = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<IGithubRepository | null>(null)

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
            key: 'stars_count',
            label: '⭐',
            align: 'center',
            render: (value: number) => value ?? 0,
        },
        {
            key: 'forks_count',
            label: '🍴',
            align: 'center',
            render: (value: number) => value ?? 0,
        },
        {
            key: 'project',
            label: 'Project',
            render: (value) => value?.name || '-',
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

    const onClose = () => setItemToDelete(null)

    return <>
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
            />

            {itemToDelete && <DeleteModal onClose={onClose} onClick={onDelete} />}
        </BodyWrapper>
    </>
}

export default GithubRepositorys;