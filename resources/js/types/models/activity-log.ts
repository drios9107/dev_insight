import type { IUser } from '../user';
import type { IProject } from './project';
import type { ITask } from './task';
import type { ITeam } from './team';

export interface IActivityLog {
    id: number;
    type: 'created' | 'updated' | 'deleted';
    description: string;
    user?: Pick<IUser, 'id' | 'name'> | null;
    team?: Pick<ITeam, 'id' | 'name'> | null;
    project?: Pick<IProject, 'id' | 'name'> | null;
    task?: Pick<ITask, 'id' | 'title'> | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at: string;
}
