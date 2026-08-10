import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { IComment } from "@/types/models/comment";
import { Head } from "@inertiajs/react";
import Header from "@/components/custom/header";
import BodyWrapper from "@/components/custom/body-wrapper";

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
                    <span>
                        User: {i.user?.name}
                    </span>
                    <span>
                        Team: {i.task?.title}
                    </span>
                    <span>
                        {i.created_at}
                    </span>
                    <CardDescription className="">
                        {i.content}
                    </CardDescription>
                </CardContent>
            </Card>)}

        </BodyWrapper>

    </>
}

export default Comments;