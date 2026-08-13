import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { INotification, TNotificationType } from "@/types/models/notification";
import { Head, router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import notification from "@/routes/notification";
import { toast } from "sonner";
import { NotificationTypeEnum } from "@/enums/notification";
import Header from "@/components/custom/header";
import { DeleteModal } from "@/components/custom/delete-modal";
import BodyWrapper from "@/components/custom/body-wrapper";
import CrudButtons from "@/components/custom/crud-buttons";

const Notifications = (props: any) => {
    const [itemToDelete, setItemToDelete] = useState<INotification | null>(null)

    const onDelete = useCallback(() => {
        if (itemToDelete) {
            router.delete(notification.destroy(itemToDelete!.id).url, {
                onSuccess: () => toast.success('Notification deleted successfully'),
                onError: (error) => toast.error(`Notification deletion failed: ${error?.message}`),
                onFinish: () => setItemToDelete(null)
            })
        }
    }, [itemToDelete])

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
            {props.list.data.map((i: INotification) => <Card key={i.id} style={{ width: '300px' }} className={'px-6'}>
                <CardTitle className="flex justify-between">
                    <div className="flex gap-1 items-center">
                        {i.title}
                    </div>
                    <Badge variant={getBadgeVariant(i.type)}>{NotificationTypeEnum[i.type as TNotificationType]}</Badge>
                    <Badge variant={i.is_read ? 'success' : 'default'}>{i.is_read ? 'Read' : 'Unread'}</Badge>
                </CardTitle>
                <CardContent className="flex flex-col flex-1 gap-1">
                    <span>
                        Owner: {i.user?.name}
                    </span>
                    <span>
                        Link: {i.link}
                    </span>
                    <span>
                        {i.read_at}
                    </span>
                    <CardDescription className="">
                        {i.message}
                    </CardDescription>
                </CardContent>
                <CrudButtons onDelete={() => setItemToDelete(i)} />
            </Card>)}

            {itemToDelete && <DeleteModal onClose={() => setItemToDelete(null)} onClick={onDelete} />}
        </BodyWrapper>

    </>
}

export default Notifications;