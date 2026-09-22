import { Head } from '@inertiajs/react';
import BodyWrapper from '@/components/custom/body-wrapper';
import Header from '@/components/custom/header';
import RowData from '@/components/custom/row-data';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
import type { IComment } from '@/types/models/comment';

const Comments = (props: any) => {
    return (
        <>
            <Head title={props.title} />
            <h1 className="sr-only">{props.title}</h1>
            <Header title={props.title} />
            <BodyWrapper>
                {props.list.data.map((i: IComment) => (
                    <Card
                        key={i.id}
                        style={{ width: '300px' }}
                        className={'px-6'}
                    >
                        <CardTitle className="flex justify-end">
                            <Badge
                                variant={i.is_internal ? 'success' : 'default'}
                            >
                                {i.is_internal ? 'Is Internal' : 'Is Public'}
                            </Badge>
                        </CardTitle>
                        <CardContent className="flex flex-1 flex-col gap-1">
                            <RowData title="User" value={i?.user?.name} />
                            <RowData title="Task" value={i?.task?.title} />
                            <RowData title="Created At" value={i?.created_at} />
                            <CardDescription className="">
                                {i.content}
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </BodyWrapper>
        </>
    );
};

export default Comments;
