import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import BodyWrapper from '@/components/custom/body-wrapper';
import { DeleteModal } from '@/components/custom/delete-modal';
import { TaskDetails } from '@/components/custom/details/task-details';
import CustomForm from '@/components/custom/forms/tasks-form';
import Header from '@/components/custom/header';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import { Badge } from '@/components/ui/badge';
import { TaskPriorityEnum, TaskStatusEnum } from '@/enums/task';
import type { TTaskPriority, TTaskStatus } from '@/enums/task';
import { getTaskPriorityColor, getTaskStatusColor } from '@/lib/utils/task';
import task from '@/routes/task';
import type { ITask, ITaskList } from '@/types/models/task';

const Tasks = (props: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemToEdit, setItemToEdit] = useState<ITask | null>(null);
    const [itemToViewId, setItemToViewId] = useState<number | null>(null);

    const columns: IColumn<ITaskList>[] = [
        {
            key: 'title',
            label: 'Title',
            sortable: true,
            className: 'min-w-[300px]',
        },
        {
            key: 'priority',
            label: 'Priority',
            sortable: true,
            render: (value: TTaskPriority) => (
                <Badge variant={getTaskPriorityColor(value)}>
                    {TaskPriorityEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value: TTaskStatus) => (
                <Badge variant={getTaskStatusColor(value)}>
                    {TaskStatusEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'assignee',
            label: 'Assignee',
            render: (value) => value?.display_name || '-',
            className: 'min-w-[200px]',
        },
        {
            key: 'reporter',
            label: 'Reporter',
            render: (value) => value?.name || '-',
            className: 'min-w-[125px]',
        },
        {
            key: 'project',
            label: 'Project',
            render: (value) => value?.name || '-',
            className: 'min-w-[200px]',
        },
        {
            key: 'sprint',
            label: 'Sprint',
            render: (value) => value?.name || '-',
            className: 'min-w-[150px]',
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
            className: 'min-w-[125px]',
        },
        {
            key: 'completed_at',
            label: 'Completed',
            sortable: true,
            render: (value) => value || '-',
            className: 'min-w-[125px]',
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
                    { preserveState: true, preserveScroll: true },
                );
            },
            options: Object.keys(TaskStatusEnum).map((i) => ({
                value: i,
                label: TaskStatusEnum[i as TTaskStatus],
            })),
            addAll: true,
        },
        {
            key: 'priority',
            label: 'Priority',
            value: props?.filters?.priority ?? 'all',
            onChange: (value: string) => {
                router.get(
                    task.index().url,
                    { ...props?.filters, priority: value, page: 1 },
                    { preserveState: true, preserveScroll: true },
                );
            },
            options: Object.keys(TaskPriorityEnum).map((i) => ({
                value: i,
                label: TaskPriorityEnum[i as TTaskPriority],
            })),
            addAll: true,
        },
        {
            key: 'project_id',
            label: 'Project',
            value: props?.filters?.project_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    task.index().url,
                    { ...props?.filters, project_id: value, page: 1 },
                    { preserveScroll: true },
                );
            },
            options:
                props?.projects?.map((p: any) => ({
                    value: String(p.id),
                    label: p.name,
                })) || [],
            addAll: true,
        },
        {
            key: 'assignee_id',
            label: 'Assignee',
            value: props?.filters?.assignee_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    task.index().url,
                    { ...props?.filters, assignee_id: value, page: 1 },
                    { preserveScroll: true },
                );
            },
            options:
                props?.github_users?.map((u: any) => ({
                    value: String(u.id),
                    label: u.display_name || u.username,
                })) || [],
            addAll: true,
        },
    ];

    const checksOptions = [
        {
            key: 'overdue',
            label: 'Is Overdue?',
            value: props?.filters?.overdue,
            onChange: (value: boolean) => {
                router.get(
                    task.index().url,
                    {
                        ...props?.filters,
                        overdue: value ? 1 : undefined,
                        page: 1,
                    },
                    { preserveState: true, preserveScroll: true },
                );
            },
        },
    ];

    const onEdit = useCallback(
        (item: ITask) => {
            setItemToEdit(item);
            setIsOpen(true);
        },
        [setItemToEdit, setIsOpen],
    );

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(task.destroy(itemToDelete).url, {
                onSuccess: () => toast.success('Task deleted successfully'),
                onError: (error) =>
                    toast.error(`Task deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null),
            });
        }
    }, [itemToDelete]);

    const onCloseForm = useCallback(() => {
        setIsOpen(false);
        setItemToEdit(null);
        setItemToDelete(null);
    }, [setIsOpen, setItemToEdit, setItemToDelete]);

    const onBulkDelete = useCallback((ids: (number | string)[]) => {
        if (
            !confirm(`Are you sure you want to delete ${ids.length} record(s)?`)
        )
            return;

        router.delete(task.bulkDestroy().url, {
            data: { ids },
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Records deleted');
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                toast.error(first ?? 'Error deleting records');
            },
        });
    }, []);

    return (
        <>
            <Head title={props.title} />
            <h1 className="sr-only">{props.title}</h1>
            <Header title={props.title} onClick={() => setIsOpen(true)} />
            <BodyWrapper>
                <DataTable
                    data={props.list}
                    columns={columns}
                    filters={filterOptions}
                    checks={checksOptions}
                    initialFilters={props.filters}
                    onView={(item) => setItemToViewId(item?.id)}
                    onEdit={onEdit}
                    onDelete={setItemToDelete}
                    onBulkDelete={onBulkDelete}
                    selectable
                />

                {isOpen && (
                    <CustomForm onClose={onCloseForm} item={itemToEdit} />
                )}
                {itemToDelete && (
                    <DeleteModal onClose={onCloseForm} onClick={onDelete} />
                )}
                {itemToViewId && (
                    <TaskDetails
                        itemId={itemToViewId}
                        onClose={() => setItemToViewId(null)}
                    />
                )}
            </BodyWrapper>
        </>
    );
};

export default Tasks;
