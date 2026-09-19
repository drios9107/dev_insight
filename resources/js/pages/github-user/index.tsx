import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { IGithubUser } from "@/types/models/github-user";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import githubUser from "@/routes/github-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ICheck } from "@/components/custom/table/data-table-filters";

const GithubUsers = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<IGithubUser | null>(null)

    const columns: IColumn[] = [
        {
            key: 'avatar_url',
            label: 'Avatar',
            align: 'center',
            render: (value: string, row: IGithubUser) => (
                <Avatar className="w-8 h-8">
                    <AvatarImage src={value || undefined} />
                    <AvatarFallback>
                        {row.display_name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            ),
        },
        {
            key: 'display_name',
            label: 'Name',
            sortable: true,
            render: (value: string, row: IGithubUser) => (
                <div>
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
                    { ...props?.filters, inactive: value ? 1 : undefined, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
        },
    ];

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(githubUser.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('GitHub user deleted successfully'),
                onError: (error) => toast.error(`Deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onClose = useCallback(() => {
        setItemToDelete(null)
    }, [setItemToDelete])

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} />
        <BodyWrapper>
            <DataTable
                data={props.list}
                columns={columns}
                checks={checksOptions}
                initialFilters={props.filters}
                onDelete={setItemToDelete}
            />

            {itemToDelete && <DeleteModal onClose={onClose} onClick={onDelete} />}
        </BodyWrapper>
    </>
}

export default GithubUsers;