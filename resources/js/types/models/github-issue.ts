import type { IUser } from '../user';
import type { IGithubRepository } from './github-repository';

export interface IGithubsIssue {
    id: number;
    github_id: string;
    number: number;
    title: string;
    body: string;
    state: TGithubsIssueState;
    github_repository: IGithubRepository;
    author: IUser;
    closed_at?: string;
    created_at: string;
    updated_at: string;
}

export type TGithubsIssueState = 'open' | 'closed';
