import { Head, router } from '@inertiajs/react';
import { Circle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import BodyWrapper from '@/components/custom/body-wrapper';
import { DeleteModal } from '@/components/custom/delete-modal';
import { ProjectDetails } from '@/components/custom/details/project-details';
import CustomForm from '@/components/custom/forms/projects-form';
import Header from '@/components/custom/header';
import type { IColumn } from '@/components/custom/table/data-table';
import { DataTable } from '@/components/custom/table/data-table';
import { Badge } from '@/components/ui/badge';
import { ProjectStatusEnum } from '@/enums/project';
import project from '@/routes/project';
import type {
    IProject,
    IProjectList,
    TProjectStatus,
} from '@/types/models/project';

const Projects = (props: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemsToDelete, setItemsToDelete] = useState<
        (string | number)[] | null
    >(null);
    const [itemToEdit, setItemToEdit] = useState<IProject | null>(null);
    const [itemToViewId, setItemToViewId] = useState<number | null>(null);

    const columns: IColumn<IProjectList>[] = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            className: 'min-w-[250px]',
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value: TProjectStatus) => (
                <Badge variant={getBadgeColor(value)}>
                    {ProjectStatusEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'team',
            label: 'Team',
            render: (value) => value?.name,
            className: 'min-w-[200px]',
        },

        {
            key: 'owner',
            label: 'Owner',
            className: 'min-w-[150px]',
            render: (value) => value?.name || '-',
        },
        {
            key: 'color',
            label: 'Color',
            render: (value: TProjectStatus) => (
                <div className="flex items-center justify-center">
                    {value ? (
                        <Circle fill={value} color={value} size={16} />
                    ) : (
                        ''
                    )}
                </div>
            ),
        },
        {
            key: 'start_date',
            label: 'Start date',
            sortable: true,
            className: 'min-w-[125px]',
            render: (value) => value ?? '-',
        },
        {
            key: 'end_date',
            label: 'End date',
            sortable: true,
            className: 'min-w-[125px]',
            render: (value) => value ?? '-',
        },
    ];

    const filterOptions = [
        {
            key: 'status',
            label: 'Estado',
            value: props?.filters?.status ?? 'all',
            onChange: (value: string) =>
                router.get(project.index().url, {
                    ...props?.filters,
                    status: value,
                }),
            options: Object.keys(ProjectStatusEnum).map((i) => ({
                value: i,
                label: ProjectStatusEnum[i as TProjectStatus],
            })),
            addAll: true,
        },
    ];

    const onEdit = useCallback(
        (item: IProject) => {
            setItemToEdit(item);
            setIsOpen(true);
        },
        [setItemToEdit, setIsOpen],
    );

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(project.destroy(itemToDelete).url, {
                onSuccess: () => toast.success('Project deleted successfully'),
                onError: (error) =>
                    toast.error(`Project deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null),
            });
        }
    }, [itemToDelete]);

    const onCloseForm = useCallback(() => {
        setIsOpen(false);
        setItemToEdit(null);
        setItemToDelete(null);
    }, [setIsOpen, setItemToEdit, setItemToDelete]);

    const onBulkDelete = useCallback(() => {
        router.delete(project.bulkDestroy().url, {
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

    const getBadgeColor = useCallback((status: TProjectStatus) => {
        const mapping = {
            planning: 'warning',
            active: 'info',
            paused: 'destructive',
            completed: 'success',
            archived: 'secondary',
        };

        return mapping[status] as
            'default' | 'destructive' | 'outline' | 'secondary';
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
                    onView={(item) => setItemToViewId(item?.id)}
                    onEdit={onEdit}
                    onDelete={setItemToDelete}
                    onBulkDelete={setItemsToDelete}
                    selectable
                />

                {itemToViewId && (
                    <ProjectDetails
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

export default Projects;
