import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import sprint from "@/routes/sprint";
import { toast } from "sonner";
import CustomForm from "@/components/custom/forms/sprints-form";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { SprintStatusEnum } from "@/enums/sprint";
import { ISprint, TSprintStatus } from "@/types/models/sprint";

const Sprints = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<ISprint | null>(null)
    const [itemToEdit, setItemToEdit] = useState<ISprint | null>(null)
    const onDetails = () => { }

    const onEdit = useCallback((item: ISprint) => {
        setItemToEdit(item)
        setIsOpen(true)
    }, [setItemToEdit, setIsOpen])

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(sprint.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Sprint deleted successfully'),
                onError: (error) => toast.error(`Sprint deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onCloseForm = () => {
        setIsOpen(false)
        setItemToEdit(null)
        setItemToDelete(null)
    }

    const getBadgeColor = useCallback((status: TSprintStatus) => {
        const mapping = {
            planning: 'warning',
            active: 'info',
            completed: 'success',
            cancelled: 'destructive',
        }
        return mapping[status] as "warning" | "info" | "success" | "destructive"
    }, [])

    const getBadgeText = useCallback((status: TSprintStatus) => {
        return SprintStatusEnum[status]
    }, [])

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} onClick={() => setIsOpen(true)} />
        <BodyWrapper>
            {props.list.data.map((i: ISprint) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        {i.name}
                    </div>
                    <Badge variant={getBadgeColor(i.status)}>{getBadgeText(i.status)}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <span>
                        Project: {i.project?.name}
                    </span>
                    <span>
                        Velocity/ActualVelocity: {i.velocity}/{i.actual_velocity}
                    </span>
                    <span>
                        {i.start_date} - {i.end_date}
                    </span>
                    <CardDescription className="">
                        {i.goal}
                    </CardDescription>
                </CardContent>
                <CrudButtons onEdit={() => onEdit(i)} onDelete={() => setItemToDelete(i)} />
            </Card>)}

            {isOpen && <CustomForm onClose={onCloseForm} item={itemToEdit} />}
            {itemToDelete && <DeleteModal onClose={onCloseForm} onClick={onDelete} />}
        </BodyWrapper>

    </>
}

export default Sprints;