import type { IUser } from '../user';
import type { ITeam } from './team';

export interface IProject {
    id: number;
    description: string;
    name: string;
    team: ITeam;
    owner: IUser;
    github_repository: number;
    status: TProjectStatus;
    start_date: string;
    end_date: string;
    color: string;
    created_at: string;
    updated_at: string;
}

export type TProjectStatus =
    'planning' | 'active' | 'paused' | 'completed' | 'archived';
