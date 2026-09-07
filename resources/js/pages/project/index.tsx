import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { IProject, TProjectStatus } from "@/types/models/project";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import project from "@/routes/project";
import { toast } from "sonner";
import { ProjectStatusEnum } from "@/enums/project";
import CustomForm from "@/components/custom/forms/projects-form";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

const Projects = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<IProject | null>(null)
    const [itemToEdit, setItemToEdit] = useState<IProject | null>(null)

    const columns: IColumn[] = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value: TProjectStatus) => <Badge variant={getBadgeColor(value)}>{ProjectStatusEnum[value]}</Badge>,
        },
        {
            key: 'team',
            label: 'Team',
            render: (value) => value?.name,
            className: 'w-full'
        },

        {
            key: 'owner',
            label: 'Owner',
            render: (value) => value?.name || '-',
        },
        {
            key: 'color',
            label: 'Color',
            render: (value: TProjectStatus) => <div className="flex items-center justify-center">
                {value ? <Circle fill={value} color={value} size={16} /> : ''}
            </div>
        },
        {
            key: 'start_date',
            label: 'Start date',
            sortable: true,
            className: 'w-40'
        },
        {
            key: 'end_date',
            label: 'End date',
            sortable: true,
            className: 'w-40'
        },
    ];

    const filterOptions = [
        {
            key: 'status',
            label: 'Estado',
            value: props?.filters?.status ?? 'all',
            onChange: (value: string) => router.get(project.index().url, { ...props?.filters, status: value }),
            options: Object.keys(ProjectStatusEnum).map(i => ({ value: i, label: ProjectStatusEnum[i as TProjectStatus] })),
            addAll: true

        },
    ];

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

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} onClick={() => setIsOpen(true)} />
        <BodyWrapper>
            <DataTable
                data={props.list}
                columns={columns}
                filters={filterOptions}
                // initialFilters={props.filters}
                onEdit={onEdit}
                onDelete={setItemToDelete}
            />
            {/* onBulkDelete={(ids) => {
                     if (confirm(`¿Eliminar ${ids.length} proyectos?`)) {
                         router.post(route('projects.bulk-destroy'), { ids });
                     }
                 }} */}

            {isOpen && <CustomForm onClose={onCloseForm} item={itemToEdit} />}
            {itemToDelete && <DeleteModal onClose={onCloseForm} onClick={onDelete} />}
        </BodyWrapper>

    </>
}

export default Projects;