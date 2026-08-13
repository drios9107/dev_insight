import { IUser } from "../user";

export interface INotification {
    id: string,
    user: IUser,
    type: TNotificationType,
    title: string,
    message: string,
    link: string,
    is_read: boolean,
    read_at: string,
}

export type TNotificationType = 'warning' | 'info' | 'error' | 'success'