import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import task from "@/routes/task";
import { toast } from "sonner";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import ColData from "@/components/custom/col-data";
import { ITask } from "@/types/models/task";
import CustomForm from "@/components/custom/forms/tasks-form";
import { TaskPriorityEnum, TaskStatusEnum, TTaskPriority, TTaskStatus } from "@/enums/task";
import RowData from "@/components/custom/row-data";

const Tasks = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<ITask | null>(null)
    const [itemToEdit, setItemToEdit] = useState<ITask | null>(null)
    const onDetails = () => { }

    const onEdit = useCallback((item: ITask) => {
        setItemToEdit(item)
        setIsOpen(true)
    }, [setItemToEdit, setIsOpen])

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(task.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Task deleted successfully'),
                onError: (error) => toast.error(`Task deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onCloseForm = () => {
        setIsOpen(false)
        setItemToEdit(null)
        setItemToDelete(null)
    }

    const getBadgeColor = useCallback((status: TTaskStatus) => {
        const mapping = {
            backlog: 'default',
            todo: 'secondary',
            in_progress: 'info',
            review: 'warning',
            done: 'success',
            cancelled: 'destructive'
        }
        return mapping[status] as 'default' | 'secondary' | 'info' | 'warning' | 'success' | 'destructive'
    }, [])

    const getPriorityColor = useCallback((item: TTaskPriority) => {
        const mapping = {
            low: 'default',
            medium: 'info',
            high: 'warning',
            critical: 'destructive',
        }
        return mapping[item] as 'default' | 'info' | 'warning' | 'destructive'
    }, [])

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} onClick={() => setIsOpen(true)} />
        <BodyWrapper>
            {props.list.data.map((i: ITask) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        <Badge variant={getPriorityColor(i.priority)}>{TaskPriorityEnum[i.priority]}</Badge>
                        {i.title}
                    </div>
                    <Badge variant={getBadgeColor(i.status)}>{TaskStatusEnum[i.status]}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    {i.project && <RowData title="Project" value={i?.project?.name} />}
                    {i.sprint && <RowData title="Sprint" value={i?.sprint?.name} />}
                    {i.assignee && <RowData title="Asignee" value={i?.assignee?.name} />}
                    {i.reporter && <RowData title="Reporter" value={i?.reporter?.name} />}
                    <RowData title="Reporter" value={`${i.due_date} - ${i.completed_at}`} />
                    <div className="flex flex-wrap gap-2 justify-between">
                        <ColData title="Story points" value={i?.story_points} />
                        <ColData title="Hours estimate" value={i?.hours_estimate} />
                        <ColData title="Hours spent" value={i?.hours_spent} />
                        <ColData title="Order" value={i?.order} />
                    </div>
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

export default Tasks;