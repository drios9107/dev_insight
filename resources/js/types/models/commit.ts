import type { IUser } from '../user';
import type { IGithubRepository } from './github-repository';
import type { ITask } from './task';

export interface ICommit {
    id: number;
    sha: number;
    github_repository?: IGithubRepository;
    author: IUser;
    task?: ITask;
    message: string;
    date: string;
    url: string;
    created_at: string;
    updated_at: string;
}
