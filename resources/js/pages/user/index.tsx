import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import BodyWrapper from '@/components/custom/body-wrapper';
import CustomAvatar from '@/components/custom/custom-avatar';
import { DeleteModal } from '@/components/custom/delete-modal';
import Header from '@/components/custom/header';
import { DataTable } from '@/components/custom/table/data-table';
import type { IColumn } from '@/components/custom/table/data-table';
import user from '@/routes/user';
import type { IUser } from '@/types/user';

const Users = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [itemsToDisable, setItemsToDisable] = useState<
        (string | number)[] | null
    >(null);
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
    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(user.destroy(itemToDelete).url, {
                onSuccess: () => toast.success('User disabled successfully'),
                onError: (error) =>
                    toast.error(`User disabled failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null),
            });
        }
    }, [itemToDelete]);

    const onBulkDelete = useCallback(() => {
        router.delete(user.bulkDestroy().url, {
            data: { ids: itemsToDisable },
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Records disabled');
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                toast.error(first ?? 'Error disabling records');
            },
        });
    }, [itemsToDisable]);

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
                    onBulkDelete={setItemsToDisable}
                    selectable
                />

                {itemToDelete && (
                    <DeleteModal
                        onClose={() => setItemToDelete(null)}
                        onClick={onDelete}
                    />
                )}
                {itemsToDisable && (
                    <DeleteModal
                        onClose={() => setItemsToDisable(null)}
                        onClick={onBulkDelete}
                        isDisable
                    />
                )}
            </BodyWrapper>
        </>
    );
};

export default Users;
