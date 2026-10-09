import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import BodyWrapper from '@/components/custom/body-wrapper';
import { DeleteModal } from '@/components/custom/delete-modal';
import { SprintDetails } from '@/components/custom/details/sprint-details';
import CustomForm from '@/components/custom/forms/sprints-form';
import Header from '@/components/custom/header';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import { Badge } from '@/components/ui/badge';
import { SprintStatusEnum } from '@/enums/sprint';
import sprint from '@/routes/sprint';
import type {
    ISprint,
    ISprintList,
    TSprintStatus,
} from '@/types/models/sprint';

const Sprints = (props: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [itemToViewId, setItemToViewId] = useState<number | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemsToDelete, setItemsToDelete] = useState<
        (string | number)[] | null
    >(null);
    const [itemToEdit, setItemToEdit] = useState<ISprint | null>(null);

    const columns: IColumn<ISprintList>[] = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            className: 'min-w-[125px]',
        },
        {
            key: 'project',
            label: 'Project',
            render: (value) => value?.name || '-',
            className: 'min-w-[180px]',
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
            render: (value) => value ?? '-',
            className: 'min-w-[125px]',
        },
        {
            key: 'end_date',
            label: 'End Date',
            sortable: true,
            render: (value) => value ?? '-',
            className: 'min-w-[125px]',
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
                    { preserveState: true, preserveScroll: true },
                );
            },
            options: Object.keys(SprintStatusEnum).map((i) => ({
                value: i,
                label: SprintStatusEnum[i as TSprintStatus],
            })),
            addAll: true,
        },
    ];

    const onEdit = useCallback(
        (item: ISprint) => {
            setItemToEdit(item);
            setIsOpen(true);
        },
        [setItemToEdit, setIsOpen],
    );

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(sprint.destroy(itemToDelete).url, {
                onSuccess: () => toast.success('Sprint deleted successfully'),
                onError: (error) =>
                    toast.error(`Sprint deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null),
            });
        }
    }, [itemToDelete]);

    const onCloseForm = useCallback(() => {
        setIsOpen(false);
        setItemToEdit(null);
        setItemToDelete(null);
    }, [setIsOpen, setItemToEdit, setItemToDelete]);

    const getBadgeColor = useCallback((status: TSprintStatus) => {
        const mapping = {
            planning: 'warning',
            active: 'info',
            completed: 'success',
            cancelled: 'destructive',
        };

        return mapping[status] as
            'warning' | 'info' | 'success' | 'destructive';
    }, []);

    const onBulkDelete = useCallback(() => {
        router.delete(sprint.bulkDestroy().url, {
            data: { ids: itemsToDelete },
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Records deleted');
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                toast.error(first ?? 'Error deleting records');
            },
        });
    }, [itemsToDelete]);

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
                    initialFilters={props.filters}
                    onView={(item) => setItemToViewId(item?.id)}
                    onEdit={onEdit}
                    onDelete={setItemToDelete}
                    onBulkDelete={onBulkDelete}
                    selectable
                />

                {itemToViewId && (
                    <SprintDetails
                        itemId={itemToViewId}
                        onClose={() => setItemToViewId(null)}
                    />
                )}
                {isOpen && (
                    <CustomForm onClose={onCloseForm} item={itemToEdit} />
                )}
                {itemToDelete && (
                    <DeleteModal onClose={onCloseForm} onClick={onDelete} />
                )}
                {itemsToDelete && (
                    <DeleteModal
                        onClose={() => setItemsToDelete(null)}
                        onClick={onBulkDelete}
                    />
                )}
            </BodyWrapper>
        </>
    );
};

export default Sprints;
