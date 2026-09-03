import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { ISprint, TSprintStatus } from "@/types/models/sprint";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import sprint from "@/routes/sprint";
import { toast } from "sonner";
import { SprintStatusEnum } from "@/enums/sprint";
import CustomForm from "@/components/custom/forms/sprints-form";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { Badge } from "@/components/ui/badge";

const Sprints = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<ISprint | null>(null)
    const [itemToEdit, setItemToEdit] = useState<ISprint | null>(null)

    const columns: IColumn[] = [
        {
            key: 'id',
            label: '#',
            sortable: true,
            align: 'center',
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'project',
            label: 'Project',
            render: (value) => value?.name || '-',
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value: TSprintStatus) => (
                <Badge variant={getBadgeColor(value)}>
                    {SprintStatusEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'start_date',
            label: 'Start Date',
            sortable: true,
            render: (value) => value || '-',
        },
        {
            key: 'end_date',
            label: 'End Date',
            sortable: true,
            render: (value) => value || '-',
        },
        {
            key: 'velocity',
            label: 'Velocity',
            align: 'center',
            render: (value) => value ?? '-',
        },
        {
            key: 'actual_velocity',
            label: 'Actual Velocity',
            align: 'center',
            render: (value) => value ?? '-',
        },
    ];

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            value: props?.filters?.status ?? 'all',
            onChange: (value: string) => {
                router.get(
                    sprint.index().url,
                    { ...props?.filters, status: value, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: Object.keys(SprintStatusEnum).map(i => ({
                value: i,
                label: SprintStatusEnum[i as TSprintStatus]
            })),
            addAll: true
        },
    ];

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

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} onClick={() => setIsOpen(true)} />
        <BodyWrapper>
            <DataTable
                data={props.list}
                columns={columns}
                filters={filterOptions}
                initialFilters={props.filters}
                onEdit={onEdit}
                onDelete={setItemToDelete}
            />

            {isOpen && <CustomForm onClose={onCloseForm} item={itemToEdit} />}
            {itemToDelete && <DeleteModal onClose={onCloseForm} onClick={onDelete} />}
        </BodyWrapper>
    </>
}

export default Sprints;