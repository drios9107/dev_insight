import type { IUser } from '../user';
import type { IGithubUser } from './github-user';

export interface ITeam {
    id: number;
    name: string;
    description: string;
    is_active: boolean;

    owner: Pick<IUser, 'id' | 'name'> | null;

    created_at: string;
    updated_at: string;
}

export interface ITeamList extends ITeam {
    github_users_count: number;
}

export interface ITeamShow extends ITeam {
    owner: Pick<IUser, 'id' | 'name' | 'avatar_url'>;
    github_users: Pick<
        IGithubUser,
        'id' | 'username' | 'display_name' | 'avatar'
    >[];

    github_users_count: number;
}
