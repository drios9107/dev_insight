import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { IPullRequestReview, TPullRequestReviewState } from "@/types/models/pull-request-review";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { PullRequestReviewStateEnum } from "@/enums/pull-requests-review";
import pullRequestReview from "@/routes/pull-request-review";
import { Badge } from "@/components/ui/badge";

const PullRequestReviews = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<IPullRequestReview | null>(null)

    const columns: IColumn[] = [
        {
            key: 'pull_request',
            label: 'PR',
            render: (value) => value?.title ? `#${value.id}` : '-',
        },
        {
            key: 'reviewer',
            label: 'Reviewer',
            render: (value) => value?.name || '-',
        },
        {
            key: 'state',
            label: 'State',
            sortable: true,
            render: (value: TPullRequestReviewState) => (
                <Badge variant={getBadgeColor(value)}>
                    {PullRequestReviewStateEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'submitted_at',
            label: 'Submitted',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString() : '-',
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString() : '-',
        },
    ];

    const filterOptions = [
        {
            key: 'state',
            label: 'State',
            value: props?.filters?.state ?? 'all',
            onChange: (value: string) => {
                router.get(
                    pullRequestReview.index().url,
                    { ...props?.filters, state: value, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: Object.keys(PullRequestReviewStateEnum).map(i => ({
                value: i,
                label: PullRequestReviewStateEnum[i as TPullRequestReviewState]
            })),
            addAll: true
        },
        {
            key: 'reviewer_id',
            label: 'Reviewer',
            value: props?.filters?.reviewer_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    pullRequestReview.index().url,
                    { ...props?.filters, reviewer_id: value, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: props?.reviewers?.map((user: any) => ({
                value: String(user.id),
                label: user.name,
            })) || [],
            addAll: true
        },
    ];

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(pullRequestReview.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('PR Review deleted successfully'),
                onError: (error) => toast.error(`PR Review deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onClose = () => setItemToDelete(null)

    const getBadgeColor = useCallback((item: TPullRequestReviewState) => {
        const mapping = {
            approved: 'success',
            changes_requested: 'warning',
            commented: 'outline',
            dismissed: 'secondary'
        }
        return mapping[item] as "success" | "warning" | "outline" | "secondary"
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

export default PullRequestReviews;