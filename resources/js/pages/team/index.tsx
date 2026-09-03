import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ITeam } from "@/types/models/team";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import CustomForm from "@/components/custom/forms/teams-form";
import { toast } from "sonner";
import team from "@/routes/team";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import RowData from "@/components/custom/row-data";

const Teams = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<ITeam | null>(null)
    const [itemToEdit, setItemToEdit] = useState<ITeam | null>(null)

    const onDetails = () => { }

    const onEdit = useCallback((item: ITeam) => {
        setItemToEdit(item)
        setIsOpen(true)
    }, [setItemToEdit, setIsOpen])

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(team.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Team deleted successfully'),
                onError: (error) => toast.error(`Team deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onCloseForm = () => {
        setIsOpen(false)
        setItemToEdit(null)
        setItemToDelete(null)
    }

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} onClick={() => setIsOpen(true)} />
        <BodyWrapper>
            {props.list.data.map((i: ITeam) => <Card key={i.id} style={{ width: '300px' }} className="px-6">
                <CardTitle className="flex justify-between">
                    {i.name}
                    <img src={i.avatar_url} width={'26px'} height={'26px'} />
                    <Badge color={i.is_active ? 'bg-green-600' : 'bg-grey-600'}>{i.is_active ? 'Is Active' : 'Is Not Active'}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <RowData title="Owner" value={i?.owner?.name} />
                    <RowData title="Created At" value={i?.created_at} />
                    <CardDescription className="">
                        {i.description}
                    </CardDescription>
                </CardContent>
                <CrudButtons onEdit={() => onEdit(i)} onDelete={() => setItemToDelete(i)} />
            </Card>)}

            {isOpen && <CustomForm onClose={onCloseForm} item={itemToEdit} />}
            {itemToDelete && <DeleteModal onClose={onCloseForm} onClick={onDelete} />}
        </BodyWrapper>

    </>
}

export default Teams;