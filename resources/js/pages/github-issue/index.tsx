import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { IGithubsIssue, TGithubsIssueState } from "@/types/models/github-issue";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { GithubIssueStateEnum } from "@/enums/githubs-issue";
import githubIssue from "@/routes/github-issue";
import { Badge } from "@/components/ui/badge";

const GithubsIssues = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<IGithubsIssue | null>(null)

    const columns: IColumn[] = [
        {
            key: 'id',
            label: '#',
            sortable: true,
            align: 'center',
        },
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
                <span className="truncate max-w-[200px] block">
                    {value}
                </span>
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
            key: 'github_repository',
            label: 'Repository',
            render: (value) => value?.full_name || '-',
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
            render: (value) => value ? new Date(value).toLocaleDateString() : '-',
        },
        {
            key: 'closed_at',
            label: 'Closed',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString() : '-',
        },
        {
            key: 'task',
            label: 'Task',
            render: (value) => value?.title ? `#${value.id}` : '-',
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
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: Object.keys(GithubIssueStateEnum).map(i => ({
                value: i,
                label: GithubIssueStateEnum[i as TGithubsIssueState]
            })),
            addAll: true
        },
        {
            key: 'repository_id',
            label: 'Repository',
            value: props?.filters?.repository_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    githubIssue.index().url,
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
            router.delete(githubIssue.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Issue deleted successfully'),
                onError: (error) => toast.error(`Issue deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onClose = () => setItemToDelete(null)

    const getBadgeColor = useCallback((status: TGithubsIssueState) => {
        const mapping = {
            open: 'warning',
            closed: 'secondary',
        }
        return mapping[status] as "warning" | "secondary"
    }, [])

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

export default GithubsIssues;