import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { ITeam } from "@/types/models/team";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import CustomForm from "@/components/custom/forms/teams-form";
import { toast } from "sonner";
import team from "@/routes/team";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageOff } from "lucide-react";

const Teams = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<ITeam | null>(null)
    const [itemToEdit, setItemToEdit] = useState<ITeam | null>(null)

    const columns: IColumn[] = [
        {
            key: 'avatar_url',
            label: 'Avatar',
            align: 'center',
            render: (value: string) => (
                <Avatar className="w-8 h-8">
                    <AvatarImage src={value || undefined} />
                    <AvatarFallback>
                        <ImageOff />
                    </AvatarFallback>
                </Avatar>
            ),
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'owner',
            label: 'Owner',
            render: (value) => value?.name || '-',
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (value: boolean) => (
                <Badge variant={value ? 'success' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            key: 'created_at',
            label: 'Created At',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString() : '-',
        },
    ];

    const filterOptions = [
        {
            key: 'is_active',
            label: 'Status',
            value: props?.filters?.is_active ?? 'all',
            onChange: (value: string) => {
                router.get(
                    team.index().url,
                    { ...props?.filters, is_active: value, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: [
                { value: 'all', label: 'All' },
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' },
            ],
            addAll: false
        },
    ];

    const onEdit = useCallback((item: ITeam) => {
        setItemToEdit(item)
        setIsOpen(true)
    }, [setItemToEdit, setIsOpen])

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(team.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Team deleted successfully'),
                onError: (error) => toast.error(`Team deletion failed: ${error?.message}`),
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

export default Teams;