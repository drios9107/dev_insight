import { IUser } from "../user";
import { IGithubRepository } from "./github-repository";
import { ITask } from "./task";

export interface IPullRequest {
    id: number;
    github_id: string;
    number: number;
    title: string;
    body: string;
    state: TPullRequestState;
    github_repository?: IGithubRepository;
    author: IUser;
    assignee?: IUser;
    task: ITask;
    base_branch: string;
    head_branch: string;
    merge_commit_sha: string;
    closed_at: string;
    merged_at: string;
    created_at: string;
    updated_at: string;
}

export type TPullRequestState = 'open' | 'closed' | 'merged'
