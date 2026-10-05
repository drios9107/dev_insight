import type { IUser } from '../user';

export type TActivityLogType =
    'created' | 'updated' | 'deleted' | 'imported' | 'synced' | 'fetched';

export interface IActivityLog {
    id: number;
    type: TActivityLogType;
    description: string;
    user?: Pick<IUser, 'id' | 'name'> | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at: string;
}
