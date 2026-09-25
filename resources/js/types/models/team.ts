import { IUser } from '../user';
import type { IGithubUser } from './github-user';

export interface ITeam {
    id: number;
    name: string;
    description: string;
    owner: IUser;
    avatar_url: string;
    is_active: boolean;
    github_users: IGithubUser[];
    github_users_count: number;
    created_at: string;
    updated_at: string;
}