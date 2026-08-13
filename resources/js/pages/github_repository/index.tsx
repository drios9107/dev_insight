import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { IGithubRepository } from "@/types/models/github-repository";
import githubRepository from "@/routes/github-repository";

const GithubRepositorys = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<IGithubRepository | null>(null)

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(githubRepository.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('GithubRepository deleted successfully'),
                onError: (error) => toast.error(`GithubRepository deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} />
        <BodyWrapper>
            {props.list.data.map((i: IGithubRepository) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        {i.full_name}
                        <Badge color={i.is_private ? 'bg-green-600' : 'bg-grey-600'}>{i.is_private ? 'Is Private' : 'Is Not Private'}</Badge>
                    </div>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <span>
                        Github Id: {i.github_id}
                    </span>
                    <span>
                        Branch: {i.default_branch}
                    </span>
                    <span>
                        Url: {i.url}
                    </span>
                    <span>
                        {i.last_synced_at}
                    </span>
                    <CardDescription className="">
                        {i.description}
                    </CardDescription>
                </CardContent>
                <CrudButtons onDelete={() => setItemToDelete(i)} />
            </Card>)}

            {itemToDelete && <DeleteModal onClose={() => setItemToDelete(null)} onClick={onDelete} />}
        </BodyWrapper>

    </>
}

export default GithubRepositorys;