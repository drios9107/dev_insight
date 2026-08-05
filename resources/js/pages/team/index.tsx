import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ITeam } from "@/types/team";
import { Head } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import CustomForm from "@/components/custom/forms/teams-form";

const Teams = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<ITeam | null>(null)
    console.log('***props', props)

    const onDetails = () => { }

    const onEdit = (item: ITeam) => {
        setItemToEdit(item)
        setIsOpen(true)
    }

    const onDelete = () => {
        // axios.delete(`/teams/${itemToEdit?.id}`)
        //     .then(response => {
        //         console.log('***response', response)
        //     })
        //     .catch(error => {
        //         console.log('***error', error)
        //     })
    }

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <h1 className="p-6">{props.title}</h1>
        <div className="flex gap-6 flex-wrap justify-center">
            <Button className="bg-green-600" onClick={() => setIsOpen(true)}><Plus /></Button>
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
                <CrudButtons onEdit={() => onEdit(i)} onDelete={onDelete} />
            </Card>)}

            {isOpen && <CustomForm onClose={() => setIsOpen(false)} item={itemToEdit} />}
        </div>

    </>
}

export default Teams;