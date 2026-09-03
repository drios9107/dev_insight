import CrudButtons from "@/components/custom/crud-buttons";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { IRole } from "@/types/models/role";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import CustomForm from "@/components/custom/forms/roles-form";
import { toast } from "sonner";
import role from "@/routes/role";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import RowData from "@/components/custom/row-data";

const Roles = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<IRole | null>(null)
    const [itemToEdit, setItemToEdit] = useState<IRole | null>(null)

    const onDetails = () => { }

    const onEdit = useCallback((item: IRole) => {
        setItemToEdit(item)
        setIsOpen(true)
    }, [setItemToEdit, setIsOpen])

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(role.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Role deleted successfully'),
                onError: (error) => toast.error(`Role deletion failed: ${error?.message}`),
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
            {props.list.data.map((i: IRole) => <Card key={i.id} style={{ width: '300px' }} className="px-6">
                <CardTitle className="flex justify-between">
                    {i.name}
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
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

export default Roles;