import CrudButtons from "@/components/custom/crud-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { IProject, TProjectStatus } from "@/types/models/project";
import { Head, router } from "@inertiajs/react";
import { Circle } from "lucide-react";
import { useCallback, useState } from "react";
import project from "@/routes/project";
import { toast } from "sonner";
import { ProjectStatusEnum } from "@/enums/project";
import CustomForm from "@/components/custom/forms/projects-form";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import RowData from "@/components/custom/row-data";
import ColData from "@/components/custom/col-data";

const Projects = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<IProject | null>(null)
    const [itemToEdit, setItemToEdit] = useState<IProject | null>(null)
    const onDetails = () => { }

    const onEdit = useCallback((item: IProject) => {
        setItemToEdit(item)
        setIsOpen(true)
    }, [setItemToEdit, setIsOpen])

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(project.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Project deleted successfully'),
                onError: (error) => toast.error(`Project deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onCloseForm = () => {
        setIsOpen(false)
        setItemToEdit(null)
        setItemToDelete(null)
    }

    const getBadgeColor = useCallback((status: TProjectStatus) => {
        const mapping = {
            planning: 'warning',
            active: 'info',
            paused: 'destructive',
            completed: 'success',
            archived: 'secondary',
        }
        return mapping[status] as "default" | "destructive" | "outline" | "secondary"
    }, [])

    const getBadgeText = useCallback((status: TProjectStatus) => {
        return ProjectStatusEnum[status]
    }, [])

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} onClick={() => setIsOpen(true)} />
        <BodyWrapper>
            {props.list.data.map((i: IProject) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        <Circle fill={i.color} color={i.color} size={16} />
                        {i.name}
                    </div>
                    <Badge variant={getBadgeColor(i.status)}>{getBadgeText(i.status)}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <RowData title="Owner" value={i?.owner?.name} />
                    <RowData title="Team" value={i?.team?.name} />
                    <div className="flex flex-wrap gap-2 justify-between">
                        <ColData title="Start Date" value={i?.start_date} />
                        <ColData title="End Date" value={i?.end_date} />
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

export default Projects;