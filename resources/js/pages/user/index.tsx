import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { Head, router } from "@inertiajs/react";
import Header from "@/components/custom/header";
import BodyWrapper from "@/components/custom/body-wrapper";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import user from "@/routes/user";
import { IUser } from "@/types/user";

const Users = (props: any) => {
    const columns: IColumn[] = [
        {
            key: 'id',
            label: '#',
            sortable: true,
            align: 'center',
        },
        {
            key: 'avatar_url',
            label: 'Avatar',
            align: 'center',
            render: (value: string, row: IUser) => (
                <Avatar className="w-8 h-8">
                    <AvatarImage src={value || undefined} />
                    <AvatarFallback>
                        {row.name?.charAt(0).toUpperCase() || 'U'}
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
            key: 'email',
            label: 'Email',
            sortable: true,
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => value?.name || '-',
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
        },
        {
            key: 'updated_at',
            label: 'Updated',
            sortable: true,
        },
    ];

    const filterOptions = [
        {
            key: 'role_id',
            label: 'Role',
            value: props?.filters?.role_id ?? 'all',
            onChange: (value: string) => {
                router.get(
                    user.index().url,
                    { ...props?.filters, role_id: value, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: props?.roles?.map((role: any) => ({
                value: String(role.id),
                label: role.name,
            })) || [],
            addAll: true
        },
    ];

    return <>
        <Head title={props.title} />
        <h1 className="sr-only">{props.title}</h1>
        <Header title={props.title} />
        <BodyWrapper>
            <DataTable
                data={props.list}
                columns={columns}
                filters={filterOptions}
                initialFilters={props.filters}
                actions={false}
                selectable={false}
            />
        </BodyWrapper>
    </>
}

export default Users;