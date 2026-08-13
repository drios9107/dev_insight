import { IUser } from "../user";

export interface IGithubsIssue {
    id: number;
    github_id: string;
    number: number;
    title: string;
    body: string;
    state: TGithubsIssueState;
    // @todo: finish this one
    // github_repository: IGithubRepository;
    author: IUser;
    closed_at?: string;
    created_at: string;
    updated_at: string;
}

export type TGithubsIssueState = 'open' | 'closed'
