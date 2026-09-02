import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { IRole } from "@/types/models/role";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import CustomForm from "@/components/custom/forms/roles-form";
import { toast } from "sonner";
import role from "@/routes/role";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { Badge } from "@/components/ui/badge";

const Roles = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<IRole | null>(null)
    const [itemToEdit, setItemToEdit] = useState<IRole | null>(null)

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
            render: (value: string) => value
        },
        {
            key: 'users_count',
            label: 'Users',
            align: 'center',
            render: (value: number) => value ?? 0,
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString() : '-',
        },
        {
            key: 'updated_at',
            label: 'Updated',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString() : '-',
        },
    ];

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
            <DataTable
                data={props.list}
                columns={columns}
                initialFilters={props.filters}
                onEdit={onEdit}
                onDelete={setItemToDelete}
            />

            {isOpen && <CustomForm onClose={onCloseForm} item={itemToEdit} />}
            {itemToDelete && <DeleteModal onClose={onCloseForm} onClick={onDelete} />}
        </BodyWrapper>
    </>
}

export default Roles;