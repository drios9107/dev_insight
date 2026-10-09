import { Head, router } from '@inertiajs/react';
import BodyWrapper from '@/components/custom/body-wrapper';
import CustomAvatar from '@/components/custom/custom-avatar';
import Header from '@/components/custom/header';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import user from '@/routes/user';
import type { IUser } from '@/types/user';
import { toast } from 'sonner';
import { useCallback } from 'react';

const Users = (props: any) => {
    const columns: IColumn[] = [
        {
            key: 'avatar_url',
            label: 'Avatar',
            align: 'center',
            render: (value: string, row: IUser) => (
                <CustomAvatar
                    src={value ?? undefined}
                    title={row.name?.charAt(0)?.toUpperCase() ?? 'U'}
                    className="h-8 w-8"
                />
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
                    { preserveState: true, preserveScroll: true },
                );
            },
            options:
                props?.roles?.map((role: any) => ({
                    value: String(role.id),
                    label: role.name,
                })) || [],
            addAll: true,
        },
    ];

    const onBulkDelete = useCallback((ids: (number | string)[]) => {
        if (
            !confirm(`Are you sure you want to delete ${ids.length} record(s)?`)
        )
            return;

        router.delete(user.bulkDestroy().url, {
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
            <Header title={props.title} />
            <BodyWrapper>
                <DataTable
                    data={props.list}
                    columns={columns}
                    filters={filterOptions}
                    initialFilters={props.filters}
                    onBulkDelete={onBulkDelete}
                    selectable
                />
            </BodyWrapper>
        </>
    );
};

export default Users;
