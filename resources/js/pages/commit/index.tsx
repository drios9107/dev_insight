import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { ICommit } from "@/types/models/commit";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import commit from "@/routes/commit";

const Commits = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<ICommit | null>(null)

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
                <span className="truncate max-w-[200px] block">
                    {value}
                </span>
            ),
        },
        {
            key: 'author',
            label: 'Author',
            render: (value) => value?.name || '-',
        },
        {
            key: 'github_repository',
            label: 'Repository',
            render: (value) => value?.full_name || '-',
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (value) => value ?? '-',
        },
        {
            key: 'task',
            label: 'Task',
            render: (value) => value?.title ? `#${value.id}` : '-',
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
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: props?.repositories?.map((repo: any) => ({
                value: String(repo.id),
                label: repo.full_name,
            })) || [],
            addAll: true
        },
    ];

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(commit.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Commit deleted successfully'),
                onError: (error) => toast.error(`Commit deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onClose = useCallback(() => setItemToDelete(null), [setItemToDelete])

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

export default Commits;