import type { IUser } from '../user';
import type { IGithubRepository } from './github-repository';
import type { ITeam } from './team';

export type TProjectStatus =
    'planning' | 'active' | 'paused' | 'completed' | 'archived';

export interface IProject {
    id: number;
    name: string;
    status: TProjectStatus;
    color: string | null;
    start_date: string | null;
    end_date: string | null;

    team: Pick<ITeam, 'id' | 'name'> | null;
    owner: Pick<IUser, 'id' | 'name' | 'avatar_url'> | null;

    created_at: string;
    updated_at: string;
}

export interface IProjectList extends IProject {}

export interface IProjectShow extends IProject {
    description: string | null;
    github_repository: Pick<
        IGithubRepository,
        'id' | 'name' | 'full_name'
    > | null;

    github_users_count?: number;
    tasks_count?: number;
    sprints_count?: number;
    progress?: number;
}
