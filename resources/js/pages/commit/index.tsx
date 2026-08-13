import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { ICommit } from "@/types/models/commit";
import commit from "@/routes/commit";
import ColData from "@/components/custom/col-data";
import RowData from "@/components/custom/row-data";

const Commits = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<ICommit | null>(null)

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(commit.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Commit deleted successfully'),
                onError: (error) => toast.error(`Commit deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} />
        <BodyWrapper>
            {props.list.data.map((i: ICommit) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-between">
                    {/* @todo check this wordwrap syntax */}
                    <div className="flex gap-1 items-center" style={{ wordWrap: 'anywhere' as unknown as 'normal' }}>
                        {i.sha}
                    </div>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <RowData title="Task" value={i?.task?.title} />
                    <RowData title="Author" value={i?.author?.name} />
                    <RowData title="Github Repository" value={i?.github_repository?.full_name} />
                    <RowData title="Url" value={i?.url} href={i?.url} />
                    <RowData title="Date" value={i?.date} />

                    <div className="flex flex-wrap gap-2 justify-between">
                        <ColData title="Additions" value={i?.additions} />
                        <ColData title="Deletions" value={i?.deletions} />
                        <ColData title="Total Changes" value={i?.total_changes} />
                    </div>
                    <CardDescription className="">
                        {i.message}
                    </CardDescription>
                </CardContent>
                <CrudButtons onDelete={() => setItemToDelete(i)} />
            </Card>)}

            {itemToDelete && <DeleteModal onClose={() => setItemToDelete(null)} onClick={onDelete} />}
        </BodyWrapper>

    </>
}

export default Commits;