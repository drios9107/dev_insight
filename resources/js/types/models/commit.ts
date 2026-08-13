import { IUser } from "../user";
import { IGithubRepository } from "./github-repository";
import { ITask } from "./task";

export interface ICommit {
    id: number;
    sha: number;
    github_repository?: IGithubRepository;
    author: IUser;
    task?: ITask;
    message: string;
    date: string;
    url: string;
    additions: number;
    deletions: number;
    total_changes: number;
    created_at: string;
    updated_at: string;
}

