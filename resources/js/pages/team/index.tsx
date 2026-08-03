import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ITeam } from "@/types/team";
import { Head } from "@inertiajs/react";

const Teams = (props: any) => {
    console.log('***props', props)

    const onDetails = () => { }

    const onEdit = () => { }

    const onDelete = () => { }

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <h1 className="p-6">{props.title}</h1>
        <div className="flex gap-6 flex-wrap justify-center">
            {props.list.data.map((i: ITeam) => <Card key={i.id} style={{ width: '300px' }} className="px-6">
                <CardTitle className="flex justify-between">
                    {i.name}
                    <img src={i.avatar_url} width={'26px'} height={'26px'} />
                    <Badge color={i.is_active ? 'bg-green-600' : 'bg-grey-600'}>{i.is_active ? 'Is Active' : 'Is Not Active'}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <span>
                        Owner: {i.owner}
                    </span>
                    <span>
                        Created: {i.created_at}
                    </span>
                    <CardDescription className="">
                        {i.description}
                    </CardDescription>
                </CardContent>
                <CrudButtons onEdit={onEdit} onDelete={onDelete} />
            </Card>)}
        </div>

    </>
}

export default Teams;