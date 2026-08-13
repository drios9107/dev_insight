import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { IPullRequestReview, TPullRequestReviewState } from "@/types/models/pull-request-review";
import { PullRequestReviewStateEnum } from "@/enums/pull-requests-review";
import pullRequestReview from "@/routes/pull-request-review";
import RowData from "@/components/custom/row-data";

const PullRequestReviews = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<IPullRequestReview | null>(null)

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(pullRequestReview.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('PR Review deleted successfully'),
                onError: (error) => toast.error(`PR Review deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

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
            {props.list.data.map((i: IPullRequestReview) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        {i.pull_request?.title}
                    </div>
                    <Badge variant={getBadgeColor(i.state)}>{PullRequestReviewStateEnum[i.state]}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <RowData title="Reviewer" value={i?.reviewer?.name} />
                    <RowData title="Github Id" value={i?.github_id} />
                    <RowData title="Submitted At" value={i?.submitted_at} />
                    <CardDescription className="">
                        {i.body}
                    </CardDescription>
                </CardContent>
                <CrudButtons onDelete={() => setItemToDelete(i)} />
            </Card>)}

            {itemToDelete && <DeleteModal onClose={() => setItemToDelete(null)} onClick={onDelete} />}
        </BodyWrapper>

    </>
}

export default PullRequestReviews;