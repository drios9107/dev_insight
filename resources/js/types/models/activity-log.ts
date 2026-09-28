import type { IUser } from '../user';
import type { IProject } from './project';
import type { ITask } from './task';
import type { ITeam } from './team';

export type TActivityLogType = 'created' | 'updated' | 'deleted';

export interface IActivityLog {
    id: number;
    type: TActivityLogType;
    description: string;
    user?: Pick<IUser, 'id' | 'name'> | null;
    team?: Pick<ITeam, 'id' | 'name'> | null;
    project?: Pick<IProject, 'id' | 'name'> | null;
    task?: Pick<ITask, 'id' | 'title'> | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at: string;
}
