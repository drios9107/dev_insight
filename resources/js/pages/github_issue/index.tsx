import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { IGithubsIssue, TGithubsIssueState } from "@/types/models/github-issue";
import { GithubIssueStateEnum } from "@/enums/githubs-issue";
import githubsIssue from "@/routes/github-issue";

const GithubsIssues = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<IGithubsIssue | null>(null)
    const [itemToEdit, setItemToEdit] = useState<IGithubsIssue | null>(null)

    const onEdit = useCallback((item: IGithubsIssue) => {
        setItemToEdit(item)
        setIsOpen(true)
    }, [setItemToEdit, setIsOpen])

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(githubsIssue.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('GithubsIssue deleted successfully'),
                onError: (error) => toast.error(`GithubsIssue deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onCloseForm = () => {
        setIsOpen(false)
        setItemToEdit(null)
        setItemToDelete(null)
    }

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
        <Header title={props.title} onClick={() => setIsOpen(true)} />
        <BodyWrapper>
            {props.list.data.map((i: IGithubsIssue) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        {i.title}
                    </div>
                    <Badge variant={getBadgeColor(i.state)}>{GithubIssueStateEnum[i.state]}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <span>
                        Author: {i.author?.name}
                    </span>
                    <span>
                        Github Id: {i.github_id}
                    </span>
                    <span>
                        Number: {i.number}
                    </span>
                    <span>
                        {i.created_at} - {i.closed_at}
                    </span>
                    <CardDescription className="">
                        {i.body}
                    </CardDescription>
                </CardContent>
                <CrudButtons onEdit={() => onEdit(i)} onDelete={() => setItemToDelete(i)} />
            </Card>)}

            {itemToDelete && <DeleteModal onClose={onCloseForm} onClick={onDelete} />}
        </BodyWrapper>

    </>
}

export default GithubsIssues;