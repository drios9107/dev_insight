import { DataTable, IColumn } from "@/components/custom/table/data-table";
import { INotification, TNotificationType } from "@/types/models/notification";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import notification from "@/routes/notification";
import { toast } from "sonner";
import { NotificationTypeEnum } from "@/enums/notification";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const Notifications = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<INotification | null>(null)

    const columns: IColumn[] = [
        {
            key: 'title',
            label: 'Title',
            sortable: true,
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (value: TNotificationType) => (
                <Badge variant={getBadgeVariant(value)}>
                    {NotificationTypeEnum[value]}
                </Badge>
            ),
        },
        {
            key: 'is_read',
            label: 'Status',
            sortable: true,
            render: (value: boolean) => (
                <Badge variant={value ? 'success' : 'default'}>
                    {value ? 'Read' : 'Unread'}
                </Badge>
            ),
        },
        {
            key: 'user',
            label: 'User',
            render: (value) => value?.name || '-',
        },
        {
            key: 'link',
            label: 'Link',
            align: 'center',
            render: (value: string) => (
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <ExternalLink className="w-4 h-4 inline" />
                    </a>
                ) : '-'
            ),
        },
        {
            key: 'created_at',
            label: 'Created',
            sortable: true,
            render: (value) => value ?? '-',
        },
        {
            key: 'read_at',
            label: 'Read At',
            sortable: true,
            render: (value) => value ?? '-',
        },
    ];

    const filterOptions = [
        {
            key: 'type',
            label: 'Type',
            value: props?.filters?.type ?? 'all',
            onChange: (value: string) => {
                router.get(
                    notification.index().url,
                    { ...props?.filters, type: value, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: Object.keys(NotificationTypeEnum).map(i => ({
                value: i,
                label: NotificationTypeEnum[i as TNotificationType]
            })),
            addAll: true
        },
        {
            key: 'is_read',
            label: 'Status',
            value: props?.filters?.is_read ?? 'all',
            onChange: (value: string) => {
                router.get(
                    notification.index().url,
                    { ...props?.filters, is_read: value, page: 1 },
                    { preserveState: true, preserveScroll: true }
                );
            },
            options: [
                { value: 'all', label: 'All' },
                { value: '1', label: 'Read' },
                { value: '0', label: 'Unread' },
            ],
            addAll: false
        },
    ];

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(notification.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Notification deleted successfully'),
                onError: (error) => toast.error(`Notification deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

    const onClose = useCallback(() => {
        setItemToDelete(null)
    }, [setItemToDelete])

    const getBadgeVariant = useCallback((item: TNotificationType) => {
        const mapping = {
            info: 'info',
            warning: 'warning',
            error: 'destructive',
            success: 'success',
        }
        return mapping[item] as "info" | "warning" | "destructive" | "success"
    }, [])

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
                onDelete={setItemToDelete}
            />

            {itemToDelete && <DeleteModal onClose={onClose} onClick={onDelete} />}
        </BodyWrapper>
    </>
}

export default Notifications;