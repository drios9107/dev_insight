import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { IPullRequest, TPullRequestState } from "@/types/models/pull-request";
import { PullRequestStateEnum } from "@/enums/pull-requests";
import pullRequest from "@/routes/pull-request";
import ColData from "@/components/custom/col-data";
import RowData from "@/components/custom/row-data";

const PullRequests = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<IPullRequest | null>(null)

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(pullRequest.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('GithubsIssue deleted successfully'),
                onError: (error) => toast.error(`GithubsIssue deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const getBadgeColor = useCallback((item: TPullRequestState) => {
        const mapping = {
            open: 'default',
            closed: 'secondary',
            merged: 'success'
        }
        return mapping[item] as "default" | "secondary" | "success"
    }, [])

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} />
        <BodyWrapper>
            {props.list.data.map((i: IPullRequest) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        {i.title}
                    </div>
                    <Badge variant={getBadgeColor(i.state)}>{PullRequestStateEnum[i.state]}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <RowData title="Task" value={i?.task?.title} />
                    <RowData title="Github Id" value={i?.github_id} />
                    <RowData title="Repository" value={i?.github_repository?.name} />
                    <RowData title="Number" value={i?.number} />

                    <div className="flex flex-wrap gap-2 justify-between">
                        <ColData title="Created At" value={i?.created_at} />
                        <ColData title="Closed At" value={i?.closed_at} />
                        <ColData title="Merged At" value={i?.merged_at} />

                        <ColData title="Author" value={i?.author?.name} />
                        <ColData title="Assignee" value={i?.assignee?.name} />
                        <ColData title="Base Branch" value={i?.base_branch} />
                        <ColData title="Head Branch" value={i?.head_branch} />
                    </div>
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

export default PullRequests;