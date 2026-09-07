import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { IComment } from "@/types/models/comment";
import { Head } from "@inertiajs/react";
import Header from "@/components/custom/header";
import BodyWrapper from "@/components/custom/body-wrapper";
import RowData from "@/components/custom/row-data";

const Comments = (props: any) => {
    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} />
        <BodyWrapper>
            {props.list.data.map((i: IComment) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-end">
                    <Badge variant={i.is_internal ? 'success' : 'default'}>{i.is_internal ? 'Is Internal' : 'Is Public'}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <RowData title="User" value={i?.github_user?.username} />
                    <RowData title="Task" value={i?.task?.title} />
                    <RowData title="Created At" value={i?.created_at} />
                    <CardDescription className="">
                        {i.content}
                    </CardDescription>
                </CardContent>
            </Card>)}

        </BodyWrapper>

    </>
}

export default Comments;