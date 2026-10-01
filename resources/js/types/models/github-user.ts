import type { ITeam } from './team';

export interface IGithubUser {
    id: number;
    username: string;
    display_name: string;
    avatar: string | null;
}

export interface IGithubUserList extends IGithubUser {
    commits_count: number;
    prs_count: number;
    reviews_count: number;
    last_synced_at: string | null;
}

export interface IGithubUserShow extends IGithubUser {
    github_id: number | null;
    name: string | null;
    email: string | null;

    commits_count?: number;
    prs_count?: number;
    reviews_count?: number;
    issues_count?: number;

    teams?: Pick<ITeam, 'id' | 'name'>[];

    last_synced_at: string | null;
    created_at: string;
    updated_at?: string;
}
