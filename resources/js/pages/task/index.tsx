import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import task from "@/routes/task";
import { toast } from "sonner";
import { TaskPriorityEnum, TaskStatusEnum, TTaskPriority, TTaskStatus } from "@/enums/task";
import CustomForm from "@/components/custom/forms/tasks-form";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { Badge } from "@/components/ui/badge";
import { ITask } from "@/types/models/task";

const Tasks = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<ITask | null>(null)
    const [itemToEdit, setItemToEdit] = useState<ITask | null>(null)

    const columns: IColumn[] = [
        {
            key: 'title',
            label: 'Title',
            sortable: true,
        },
        {
            key: 'priority',
            label: 'Priority',
            sortable: true,
            render: (value: TTaskPriority) => (
                <Badge variant={getPriorityColor(value)}>
                    {TaskPriorityEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value: TTaskStatus) => (
                <Badge variant={getBadgeColor(value)}>
                    {TaskStatusEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'assignee',
            label: 'Assignee',
            render: (value) => value?.name || '-',
        },
        {
            key: 'reporter',
            label: 'Reporter',
            render: (value) => value?.name || '-',
        },
        {
            key: 'project',
            label: 'Project',
            render: (value) => value?.name || '-',
        },
        {
            key: 'sprint',
            label: 'Sprint',
            render: (value) => value?.name || '-',
        },
        {
            key: 'story_points',
            label: 'Points',
            align: 'center',
            render: (value) => value ?? '-',
        },
        {
            key: 'due_date',
            label: 'Due Date',
            sortable: true,
            render: (value) => value || '-',
        },
        {
            key: 'completed_at',
            label: 'Completed',
            sortable: true,
            render: (value) => value || '-',
        },
    ];

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            value: props?.filters?.status ?? 'all',
            onChange: (value: string) => {
                router.get(
                    task.index().url,
                    { ...props?.filters, status: value, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: Object.keys(TaskStatusEnum).map(i => ({
                value: i,
                label: TaskStatusEnum[i as TTaskStatus]
            })),
            addAll: true
        },
        {
            key: 'priority',
            label: 'Priority',
            value: props?.filters?.priority ?? 'all',
            onChange: (value: string) => {
                router.get(
                    task.index().url,
                    { ...props?.filters, priority: value, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: Object.keys(TaskPriorityEnum).map(i => ({
                value: i,
                label: TaskPriorityEnum[i as TTaskPriority]
            })),
            addAll: true
        },
    ];

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

export default Tasks;